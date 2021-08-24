import { notifier } from '@beyonk/svelte-notifications';

export function shareDashboard(deviceUID) {
  if (navigator.share) { // Share Device URL with Web Share API
    navigator.share({
      title: 'Device Dashboard',
      url: `https://airnote.live/${deviceUID}`
    }).then(() => {
      notifier.success('Thanks for sharing!');
    })
    .catch(console.error);
  } else {
    // Fallback to copying text to the users clipboard with a
    // hacky cross-browser approach.
    const el = document.createElement('textarea');
    el.value = `https://airnote.live/${deviceUID}`;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    notifier.success('Dashboard URL copied to clipboard!');
  }
}