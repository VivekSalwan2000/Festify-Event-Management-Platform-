/**
 * @jest-environment jsdom
 */

import {
    signUpUser,
    signInUser,
    signOutUser,
    onUserStateChanged,
    saveUserProfile,
    getUserProfile
  } from '../Festify/firebase.js';
  
  // Mock Firebase Auth and Firestore modules
  import * as firebaseAuth from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
  import * as firebaseFirestore from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
  
  jest.mock("https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js", () => ({
    createUserWithEmailAndPassword: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(),
    getAuth: () => ({})
  }));
  
  jest.mock("https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js", () => ({
    doc: jest.fn(),
    setDoc: jest.fn(),
    getDoc: jest.fn(),
    getFirestore: () => ({})
  }));
  
  describe('firebase.js module', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('signUpUser should call createUserWithEmailAndPassword', async () => {
      const mockUserCred = { user: { uid: '123' } };
      firebaseAuth.createUserWithEmailAndPassword.mockResolvedValue(mockUserCred);
  
      const result = await signUpUser('test@example.com', 'password');
      expect(firebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), 'test@example.com', 'password');
      expect(result).toEqual(mockUserCred);
    });
  
    it('signInUser should call signInWithEmailAndPassword', async () => {
      const mockUserCred = { user: { uid: '456' } };
      firebaseAuth.signInWithEmailAndPassword.mockResolvedValue(mockUserCred);
  
      const result = await signInUser('test@example.com', 'password');
      expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), 'test@example.com', 'password');
      expect(result).toEqual(mockUserCred);
    });
  
    it('signOutUser should call signOut', async () => {
      firebaseAuth.signOut.mockResolvedValue();
      await signOutUser();
      expect(firebaseAuth.signOut).toHaveBeenCalledWith(expect.any(Object));
    });
  
    it('onUserStateChanged should register the callback', () => {
      const callback = jest.fn();
      onUserStateChanged(callback);
      expect(firebaseAuth.onAuthStateChanged).toHaveBeenCalledWith(expect.any(Object), callback);
    });
  
    it('saveUserProfile should call setDoc with merge option', async () => {
      firebaseFirestore.setDoc.mockResolvedValue();
      await saveUserProfile('uid123', { firstName: 'Test' });
      expect(firebaseFirestore.doc).toHaveBeenCalled();
      expect(firebaseFirestore.setDoc).toHaveBeenCalledWith(expect.anything(), { firstName: 'Test' }, { merge: true });
    });
  
    it('getUserProfile should return profile data if exists', async () => {
      const mockData = { firstName: 'Test' };
      firebaseFirestore.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockData,
      });
      const result = await getUserProfile('uid123');
      expect(firebaseFirestore.doc).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  
    it('getUserProfile should return null if profile does not exist', async () => {
      firebaseFirestore.getDoc.mockResolvedValue({
        exists: () => false,
      });
      const result = await getUserProfile('uid123');
      expect(result).toBeNull();
    });
  });
  