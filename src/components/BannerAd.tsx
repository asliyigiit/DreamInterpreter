import React from 'react';
import { AdMobBanner } from 'expo-ads-admob';
import CONFIG from '../config/config';

export const BannerAd: React.FC = () => (
  <AdMobBanner
    bannerSize="smartBannerPortrait"
    adUnitID={CONFIG.ads.bannerAdUnitId}
    servePersonalizedAds={false}
    onDidFailToReceiveAdWithError={(error) => console.error(error)}
  />
); 