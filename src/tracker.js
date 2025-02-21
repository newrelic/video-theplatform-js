import * as nrvideo from 'newrelic-video-core'
import { version } from '../package.json'
import ThePlatformAdsTracker from './ads'

export default class ThePlatformTracker extends nrvideo.VideoTracker {
  constructor (player, options) {
    super(player, options)
    this.scope = options ? options.scope : undefined
    if (!player && $pdk) {
      this.setPlayer($pdk.controller)
    }
    this.resetValues()
  }

  resetValues () {
    this.src = null
    this.title = null
    this.duration = null
    this.playhead = null
    this.renditionBitrate = null
    this.renditionWidth = null
    this.renditionHeight = null
    this.live = null
    this.muted = null
  }

  getTrackerName () {
    return 'theplatform'
  }

  getTrackerVersion () {
    return version
  }

  getVideoId () {
    return this.videoId
  }

  getPlayhead () {
    return this.playhead
  }

  getDuration () {
    return this.duration
  }

  isLive () {
    return this.live
  }

  getTitle () {
    return this.title
  }

  getSrc () {
    return this.src
  }

  getRenditionBitrate () {
    return this.renditionBitrate
  }

  getRenditionWidth () {
    return this.renditionWidth
  }

  getRenditionHeight () {
    return this.renditionHeight
  }

  getPlayerVersion () {
    if ($pdk) {
      const versionString = $pdk.version.toString();
      const versionMatch = versionString.match(/^(\d+\.\d+\.\d+)/);
      return versionMatch ? versionMatch[1] : versionString;
    }
  }

  isMuted () {
    return this.muted
  }

  getInstrumentationProvider() {
    return 'New Relic';
  }

  getPlayerName() { 
    if ($pdk.name) return $pdk.name
    else return 'thePlatform';
  }

  getInstrumentationName() {
    return this.getPlayerName();
  }

  getInstrumentationVersion() {
    return this.getPlayerVersion();
  }

  initAdTracker () {
    this.setAdsTracker(new ThePlatformAdsTracker(this.player))
  }

  registerListeners () {
    this.initAdTracker()

    nrvideo.Log.debugCommonVideoEvents(this.player, [
      null, 'OnMediaPause', 'OnMediaUnpause', 'OnClipInfoLoaded', 'OnMediaBuffering', 'OnMediaEnd',
      'OnMediaError', 'OnVersionError', 'OnMediaPlay', 'OnMediaSeek', 'OnMediaStart', 'OnMute',
      'OnMediaLoadStart', 'OnResetPlayer', 'OnReleaseEnd', 'OnReleaseStart', 'OnReleaseSelected',
      'OnPlayerLoaded', 'OnMediaBufferStart', 'OnMediaBufferComplete', 'OnRenditionSwitched'
    ], function (e) {
      nrvideo.Log.debug('Event: ' + e.type, e)
    })

    this.player.addEventListener('OnPlayerLoaded', this.onPlayerLoaded.bind(this), this.scope)
    this.player.addEventListener('OnReleaseStart', this.onReleaseStart.bind(this), this.scope)
    this.player.addEventListener('OnReleaseEnd', this.onReleaseEnd.bind(this), this.scope)
    this.player.addEventListener('OnMediaLoadStart', this.onMediaLoadStart.bind(this), this.scope)
    this.player.addEventListener('OnMediaStart', this.onMediaStart.bind(this), this.scope)
    this.player.addEventListener('OnRenditionSwitched', this.onRenditionSwitched.bind(this),
      this.scope)
    this.player.addEventListener('OnMediaPlaying', this.onMediaPlaying.bind(this), this.scope)
    this.player.addEventListener('OnMediaPause', this.onMediaPause.bind(this), this.scope)
    this.player.addEventListener('OnMediaUnpause', this.onMediaUnpause.bind(this), this.scope)
    this.player.addEventListener('OnMediaError', this.onMediaError.bind(this), this.scope)
    this.player.addEventListener('OnReleaseError', this.onReleaseError.bind(this), this.scope)
    this.player.addEventListener('OnMediaSeek', this.onMediaSeek.bind(this), this.scope)
    this.player.addEventListener('OnMute', this.onMute.bind(this), this.scope)
    this.player.addEventListener('OnMediaBufferStart', this.onMediaBufferStart.bind(this),
      this.scope)
    this.player.addEventListener('OnMediaBufferComplete', this.onMediaBufferComplete.bind(this),
      this.scope)
  }

  unregisterListeners () {
    this.player.removeEventListener('OnPlayerLoaded', this.onPlayerLoaded, this.scope)
    this.player.removeEventListener('OnReleaseStart', this.onReleaseStart, this.scope)
    this.player.removeEventListener('OnReleaseEnd', this.onReleaseEnd, this.scope)
    this.player.removeEventListener('OnMediaLoadStart', this.onMediaLoadStart, this.scope)
    this.player.removeEventListener('OnMediaStart', this.onMediaStart, this.scope)
    this.player.removeEventListener('OnRenditionSwitched', this.onRenditionSwitched, this.scope)
    this.player.removeEventListener('OnMediaPlaying', this.onMediaPlaying, this.scope)
    this.player.removeEventListener('OnMediaPause', this.onMediaPause, this.scope)
    this.player.removeEventListener('OnMediaUnpause', this.onMediaUnpause, this.scope)
    this.player.removeEventListener('OnMediaError', this.onMediaError, this.scope)
    this.player.removeEventListener('OnReleaseError', this.onReleaseError, this.scope)
    this.player.removeEventListener('OnMediaSeek', this.onMediaSeek, this.scope)
    this.player.removeEventListener('OnMute', this.onMute, this.scope)
    this.player.removeEventListener('OnMediaBufferStart', this.onMediaBufferStart, this.scope)
    this.player.removeEventListener('OnMediaBufferComplete', this.onMediaBufferComplete, this.scope)
  }

  onPlayerLoaded (e) {
    this.sendPlayerReady()
  }

  onReleaseStart (e) {
    this.title = e.data.title
    if (e.data.release) {
      this.duration = e.data.release.duration
      this.renditionBitrate = e.data.release.bitrate
    }

    this.sendRequest()
  }

  onReleaseEnd (e) {
    this.sendEnd()
    this.resetValues()
  }

  onMediaLoadStart (e) {
    let clip = e.data
    let bc = clip.baseClip || clip

    if (!bc.isAd) { // only if content
      this.live = (bc.expression === 'nonstop')
      this.src = bc.URL
      this.duration = bc.trueLength || bc.mediaLength
      this.renditionBitrate = bc.bitrate
      this.renditionHeight = bc.height
      this.renditionWidth = bc.width
      this.videoId = bc.contentID
    }
  }

  onMediaStart (e) {
    let clip = e.data
    let bc = clip.baseClip || clip

    if (!bc.isAd) { // only if content
      this.live = (bc.expression === 'nonstop')
      this.src = bc.URL
      this.duration = bc.trueLength || bc.mediaLength
      this.renditionBitrate = bc.bitrate
      this.renditionHeight = bc.height
      this.renditionWidth = bc.width
      this.videoId = bc.contentID
    }
  }

  onMediaPlaying (e) {
    if (!this.adsTracker || !this.adsTracker.state.isRequested) { // content
      this.playhead = e.data.currentTimeAggregate || e.data.currentTime
      this.sendStart()
      this.sendBufferEnd()
      this.sendSeekEnd()
    }
  }

  onMediaPause (e) {
    this.sendPause()
  }

  onMediaUnpause (e) {
    this.sendResume()
  }

  onRenditionSwitched (e) {
    let r = e.data.newRendition
    if (this.renditionBitrate <= 0 && r.bitrate) this.renditionBitrate = r.bitrate
    if (this.renditionHeight <= 0 && r.height) this.renditionHeight = r.height
    if (this.renditionWidth <= 0 && r.width) this.renditionWidth = r.width
    this.sendRenditionChanged()
  }

  onMediaError (e) {
    let clip = e.data.clip
    let bc = clip.baseClip || clip
    if (!bc.isAd) { // content
      this.src = e.data.clip.URL || bc.URL
      this.title = e.data.clip.title
      this.duration = e.data.clip.mediaLength
      this.sendError({ errorMessage: e.data.friendlyMessage, errorDetail: e.data.message, errorCode: e.data.responseCode, errorName: e.data.title })
    } else { // Ad
      this.sendStart()
    }
  }

  onReleaseError (e) {
    this.src = e.data.URL || e.data
    this.sendError({ errorMessage: 'Release error' })
  }

  onMediaSeek (e) {
    this.sendSeekStart()
  }

  onMute (e) {
    this.muted = e.data
  }

  onMediaBufferStart (e) {
    let clip = e.data
    let bc = clip.baseClip || clip
    if (!bc.isAd) { // only if content
      this.sendBufferStart()
    }
  }

  onMediaBufferComplete (e) {
    let clip = e.data
    let bc = clip.baseClip || clip
    if (!bc.isAd) { // only if content
      this.sendBufferEnd()
    }
  }
}

// Static members
export {
  ThePlatformAdsTracker
}
