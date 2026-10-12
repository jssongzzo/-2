import firebaseConfig from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendEmailVerification } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js';

const configured = !!(firebaseConfig.apiKey && firebaseConfig.apiKey !== 'PASTE_API_KEY_HERE' && firebaseConfig.projectId && firebaseConfig.projectId !== 'YOUR_PROJECT_ID' && firebaseConfig.appId && firebaseConfig.appId !== 'PASTE_APP_ID_HERE');
let app, auth, db, storage;
const wordsRef = () => doc(db, 'appData', 'words');
const adsRef = () => doc(db, 'appData', 'ads');
const wordsKey = 'wordSprintBook2-4.words.v3';
const adsKey = 'wordSprintBook2-4.adImages.v1';
const cloud = {
  ready: configured,
  user: null,
  async login(email, password) {
    if (!configured) throw new Error('firebase-config.js에 Firebase 웹 앱 설정값을 입력하세요.');
    const credential = await signInWithEmailAndPassword(auth, email, password);
    if (!credential.user.emailVerified) {
      try { await sendEmailVerification(credential.user); } catch (_) {}
      await signOut(auth);
      throw new Error('이메일 인증 메일을 보냈습니다. 메일의 인증 링크를 누른 뒤 다시 로그인하세요.');
    }
    cloud.user = credential.user;
    return credential.user;
  },
  async logout() { if (auth) await signOut(auth); cloud.user = null; },
  async saveWords(words) {
    if (!configured) throw new Error('Firebase가 설정되지 않았습니다.');
    if (!cloud.user) throw new Error('클라우드 저장은 관리자 로그인 후 가능합니다.');
    await setDoc(wordsRef(), { words, updatedAt: serverTimestamp() });
  },
  async saveAds(ads) {
    if (!configured) throw new Error('Firebase가 설정되지 않았습니다.');
    if (!cloud.user) throw new Error('클라우드 저장은 관리자 로그인 후 가능합니다.');
    await setDoc(adsRef(), { ads: ads.slice(0, 3), updatedAt: serverTimestamp() });
  },
  async uploadAdImage(image, slot) {
    if (!configured || !cloud.user) throw new Error('Firebase 관리자 로그인이 필요합니다.');
    if (!image) return '';
    if (/^https:\/\//i.test(image)) return image;
    let blob;
    if (image.startsWith('data:')) {
      const response = await fetch(image);
      blob = await response.blob();
    } else throw new Error('광고 이미지 형식을 확인하세요.');
    if (!blob.type.startsWith('image/')) throw new Error('이미지 파일만 업로드할 수 있습니다.');
    if (blob.size > 5 * 1024 * 1024) throw new Error('이미지 파일은 5MB 이하로 선택하세요.');
    // Use a new object name for every upload so Android Chrome/service-worker caches
    // cannot keep showing an older image for the same ad slot.
    const objectRef = ref(storage, `ads/ad-${slot}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`);
    await uploadBytes(objectRef, blob, { contentType: 'image/jpeg', cacheControl: 'public,max-age=300' });
    return await getDownloadURL(objectRef);
  },
  async seedIfMissing() {
    if (!configured || !cloud.user) return;
    const w = await getDoc(wordsRef());
    if (!w.exists()) {
      let localWords = [];
      try { localWords = JSON.parse(localStorage.getItem(wordsKey) || '[]'); } catch (_) {}
      if (!Array.isArray(localWords) || !localWords.length) localWords = (window.getDefaultWords && window.getDefaultWords()) || [];
      if (localWords.length) await this.saveWords(localWords);
    }
    const a = await getDoc(adsRef());
    if (!a.exists()) {
      let localAds = [];
      try { localAds = JSON.parse(localStorage.getItem(adsKey) || '[]'); } catch (_) {}
      const uploaded = [];
      for (let i = 0; i < Math.min(3, localAds.length); i++) {
        const ad = localAds[i];
        if (ad && ad.image && ad.url) uploaded.push({ ...ad, slot: i + 1, image: await this.uploadAdImage(ad.image, i + 1) });
      }
      await this.saveAds(uploaded);
    }
  }
};

if (configured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    onAuthStateChanged(auth, user => {
      cloud.user = user && user.emailVerified ? user : null;
      const status = document.getElementById('cloudStatus');
      if (status) status.textContent = cloud.user ? `Firebase 연결됨 · 관리자 ${cloud.user.email}` : 'Firebase 연결됨 · 단어와 광고는 모든 기기에 공유됩니다. 수정하려면 관리자 로그인이 필요합니다.';
    });
    onSnapshot(wordsRef(), snap => {
      if (!snap.exists()) return;
      const words = snap.data().words;
      if (!Array.isArray(words) || !words.length) return;
      localStorage.setItem(wordsKey, JSON.stringify(words));
      if (typeof window.updateWordCount === 'function') window.updateWordCount();
      if (typeof window.renderWordList === 'function') window.renderWordList();
    }, err => setCloudError('단어 읽기 오류: ' + err.message));
    onSnapshot(adsRef(), snap => {
      if (!snap.exists()) return;
      const ads = snap.data().ads;
      if (!Array.isArray(ads)) return;
      localStorage.setItem(adsKey, JSON.stringify(ads.slice(0, 3)));
      if (typeof window.applyAdSettings === 'function') window.applyAdSettings();
      if (typeof window.loadAdminSettings === 'function' && window.adminUnlocked) window.loadAdminSettings();
    }, err => setCloudError('광고 읽기 오류: ' + err.message));
  } catch (e) {
    cloud.ready = false;
    setCloudError('Firebase 초기화 오류: ' + e.message);
  }
} else {
  setTimeout(() => {
    const status = document.getElementById('cloudStatus');
    if (status) status.textContent = 'Firebase 설정 필요: firebase-config.js의 프로젝트 설정값을 입력한 뒤 배포하세요. 현재는 이 기기의 로컬 데이터만 표시됩니다.';
  }, 0);
}
function setCloudError(message) {
  const status = document.getElementById('cloudStatus');
  if (status) status.textContent = message;
}
window.CloudSync = cloud;
