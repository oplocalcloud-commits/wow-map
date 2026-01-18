
import { AdMob, RewardAdOptions, AdMobRewardEventNames } from '@capacitor-community/admob';
import { AD_CONFIG } from '../constants';
import { Capacitor } from '@capacitor/core';

/**
 * Mobile Native Ad Service
 * Bridges the React UI with Android/iOS native AdMob SDK
 */
export const initAds = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      await AdMob.initialize({
        requestTrackingAuthorization: true,
        testingDevices: AD_CONFIG.IS_TEST_MODE ? ['2077ef9a63d2b398840261cdd22eb785'] : [],
        initializeForTesting: AD_CONFIG.IS_TEST_MODE,
      });
      console.log('AdMob Initialized on Native');
    } catch (e) {
      console.error('AdMob Init Failed:', e);
    }
  } else {
    console.log('Web Ad Protocol: Simulation Mode Enabled');
  }
};

/**
 * Trigger real Rewarded Ad on Mobile or Simulation on Web
 */
export const showRewardedAd = async (onComplete: () => void, onFailed: () => void) => {
  if (!Capacitor.isNativePlatform()) {
    console.log('Web Simulation: Ad logic bypassed for browser preview');
    return 'simulation';
  }

  try {
    const adId = Capacitor.getPlatform() === 'ios' 
      ? AD_CONFIG.IOS_REWARDED_ID 
      : AD_CONFIG.ANDROID_REWARDED_ID;

    const options: RewardAdOptions = {
      adId: adId,
      isTesting: AD_CONFIG.IS_TEST_MODE,
    };

    await AdMob.prepareRewardAd(options);
    
    // Add listener for reward completion
    const rewardListener = await AdMob.addListener(AdMobRewardEventNames.Rewarded, (reward) => {
      console.log('User Rewarded:', reward);
      onComplete();
      rewardListener.remove();
    });

    // Add listener for dismissal/failure
    const dismissListener = await AdMob.addListener(AdMobRewardEventNames.Dismissed, () => {
      dismissListener.remove();
    });

    await AdMob.showRewardAd();
    return 'success';
  } catch (error) {
    console.error('AdMob Error:', error);
    onFailed();
    return 'error';
  }
};
