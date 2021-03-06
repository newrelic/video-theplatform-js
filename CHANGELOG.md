# CHANGELOG

## [0.3.0] - 2020/05/04
### Fix
- Update dependencies to fix multiple vulnerabilities.

## [0.2.1] - 2017/12/11
### Fix
- Tracker now supports rendition switching propperly on ABR streams.

## [0.2.0] - 2017/11/10
### Add
- Tracker will now support both `PDK5` and `PDK6`.

### Lib
- Updated for core lib `0.9+`.


## [0.1.5] - 2017/10/16
### Add
- Add `OnReleaseError` listener to fire errors.

### Change
- Added `initAdTracker` intermediate function to allow extension.

## [0.1.4] - 2017/10/05
### Fix
- Fix `contentDuration` being sent in sec instead of ms.

## [0.1.3] - 2017/09/28
### Fix
- Fix `adTtile` not being fetch for Freewheel ads.
- Fix `sample.html` file to include ad plugins.
- Fix `buffer` not being fired in some cases.
- Fix `AD_END` not being fired in some cases.

## [0.1.2] - 2017/09/26
### Fix
- Fix `AD_ERROR` and `AD_END` not being sent when an adError occurs.

### Add
- Add `adTitle` additional check in `AD_START`.


## [0.1.1] - 2017/09/20
### Fix
- Fix `AD_ERROR` not being fired if the ad has not started.
- Fix `AD_START` not being sent.

## [0.1.0] - 
- First Version
