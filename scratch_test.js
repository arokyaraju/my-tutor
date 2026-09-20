async function check() {
  const res = await fetch('https://www.youtube.com/watch?v=h9afNFBcJVw');
  const text = await res.text();
  console.log('playableInEmbed:', text.includes('playableInEmbed'));
  console.log('UNPLAYABLE:', text.includes('UNPLAYABLE'));
  console.log('embeddable:true:', text.includes('"embeddable":true'));
  console.log('embeddable:false:', text.includes('"embeddable":false'));

  // Also check embed page directly
  const embedRes = await fetch('https://www.youtube-nocookie.com/embed/h9afNFBcJVw');
  const embedText = await embedRes.text();
  console.log('embedRes status:', embedRes.status);
  console.log('embed has UNPLAYABLE:', embedText.includes('UNPLAYABLE'));
  console.log('embed has "Video unavailable":', embedText.includes('Video unavailable'));
}
check();
