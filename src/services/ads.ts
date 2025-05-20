import React from 'react';
import { Platform } from 'react-native';
import {
  AdMobBanner,
  AdMobInterstitial,
  setTestDeviceIDAsync,
} from 'expo-ads-admob';
import CONFIG from '../config/config';
export { BannerAd } from '../components/BannerAd';

class AdService {
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      if (__DEV__) {
        await setTestDeviceIDAsync('SIMULATOR');
      }
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize AdMob:', error);
    }
  }

  async showInterstitial(): Promise<boolean> {
    try {
      await this.initialize();
      await AdMobInterstitial.setAdUnitID(CONFIG.ads.interstitialAdUnitId);
      await AdMobInterstitial.requestAdAsync();
      await AdMobInterstitial.showAdAsync();
      return true;
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
      return false;
    }
  }
}

export default new AdService(); 