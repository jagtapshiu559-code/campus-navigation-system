(() => {
 const translations = {
  en: {'journey':'📍 Select Your Journey','Choose where you are and where you want to go.':'Choose where you are and where you want to go.','Starting Location':'Starting Location','Destination':'Destination','Find My Route':'Find My Route','🗺️ Campus Map':'🗺️ Campus Map','➡️ Turn-by-Turn Directions':'➡️ Turn-by-Turn Directions','← Back to Home':'← Back to Home'},
  mr: {'journey':'📍 तुमचा प्रवास निवडा','Choose where you are and where you want to go.':'तुमचे सध्याचे ठिकाण आणि गंतव्य निवडा.','Starting Location':'सुरुवातीचे ठिकाण','Destination':'गंतव्य स्थान','Find My Route':'माझा मार्ग शोधा','🗺️ Campus Map':'🗺️ कॅम्पस नकाशा','➡️ Turn-by-Turn Directions':'➡️ टप्प्याटप्प्याने दिशा','← Back to Home':'← मुख्यपृष्ठावर परत'},
  hi: {'journey':'📍 अपनी यात्रा चुनें','Choose where you are and where you want to go.':'अपना वर्तमान स्थान और गंतव्य चुनें।','Starting Location':'शुरुआती स्थान','Destination':'गंतव्य स्थान','Find My Route':'मेरा रास्ता खोजें','🗺️ Campus Map':'🗺️ कैंपस का नक्शा','➡️ Turn-by-Turn Directions':'➡️ कदम-दर-कदम दिशा','← Back to Home':'← होम पर वापस'}
 };
 function apply(lang) {
  const dict=translations[lang]||translations.en;
  document.documentElement.lang=lang;
  document.querySelectorAll('h2,p,label,button,a').forEach(el=>{
    if (!el.dataset.originalText) el.dataset.originalText=el.textContent.trim();
    const original=el.dataset.originalText;
    if(dict[original]) el.textContent=dict[original];
    else if(el.dataset.i18n==='journey') el.textContent=dict.journey;
  });
  document.querySelectorAll('option').forEach(el=>{
    if (!el.dataset.originalText) el.dataset.originalText=el.textContent.trim();
    if(dict[el.dataset.originalText]) el.textContent=dict[el.dataset.originalText];
  });
  try { localStorage.setItem('campusLanguage',lang); } catch(e) {}
 }
 document.addEventListener('DOMContentLoaded',()=>{
  const select=document.getElementById('siteLanguage'); if(!select)return;
  let lang='en'; try {lang=localStorage.getItem('campusLanguage')||'en';}catch(e){}
  select.value=lang; apply(lang); select.addEventListener('change',()=>apply(select.value));
 });
})();
