const totalHadiths = 40;

// قائمة بالصور المحلية
const images = [

    'images/nature23.jpg',

    // أضف المزيد من الصور كما تريد
];

// دالة لاختيار صورة خلفية عشوائية من الصور المحلية
const setRandomBackground = () => {
    const randomIndex = Math.floor(Math.random() * images.length);
    const imageUrl = images[randomIndex];
    document.body.style.backgroundImage = `url(${chrome.runtime.getURL(imageUrl)})`;
    document.body.style.backgroundSize = 'cover';  // تجعل الصورة تغطي الصفحة
    document.body.style.backgroundPosition = 'center'; // تركز الصورة في منتصف الصفحة
    document.body.style.backgroundRepeat = 'no-repeat'; // تمنع تكرار الصورة
    document.body.style.height = '100vh'; // تضبط ارتفاع الصفحة ليغطي الشاشة بالكامل
    document.body.style.margin = '0'; // إزالة أي مسافات خارجية
};


// الدالة لجلب الحديث
const getCurrentHadithNumber = () => {
    return new Promise((resolve) => {
        chrome.storage.local.get(['currentHadithNumber'], (result) => {
            resolve(result.currentHadithNumber || 1);
        });
    });
};

const setCurrentHadithNumber = (number) => {
    chrome.storage.local.set({ 'currentHadithNumber': number });
};

// الدالة لجلب الحديث
const getHadith = async (number) => {
    const url = `https://sunnah.com/nawawi40:${number}`;
    const response = await fetch(url);
    const text = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    
    // جلب النص العربي
    let arabicText = doc.querySelector('.arabic_hadith_full') 
        ? doc.querySelector('.arabic_hadith_full').innerText 
        : "Arabic text not found";
    
    // جلب النص الإنجليزي باستخدام innerHTML لجلب العلامات
    let englishText = doc.querySelector('.text_details') 
        ? doc.querySelector('.text_details').innerHTML 
        : "English text not found";

    
    // فلترة النصوص لإزالة الروابط والعناصر غير المرغوب فيها
    englishText = englishText.replace(/<a[^>]*>(.*?)<\/a>/gi, ''); // إزالة الروابط
    englishText = englishText.replace(/<\/?[^>]+(>|$)/g, ""); // إزالة جميع العلامات HTML
    englishText = englishText.replace(/&nbsp;/g, ' '); // إزالة &nbsp; إذا وجدت    

    // تخصيص النص للحديث رقم 2
    if (number === 2) {        
        arabicText = `عَنْ عُمَرَ رَضِيَ اللهُ عَنْهُ أَيْضًا قَالَ: " بَيْنَمَا نَحْنُ جُلُوسٌ عِنْدَ رَسُولِ اللَّهِ صلى الله عليه و سلم ذَاتَ يَوْمٍ، إذْ طَلَعَ عَلَيْنَا رَجُلٌ شَدِيدُ بَيَاضِ الثِّيَابِ، شَدِيدُ سَوَادِ الشَّعْرِ، لَا يُرَى عَلَيْهِ أَثَرُ السَّفَرِ، وَلَا يَعْرِفُهُ مِنَّا أَحَدٌ. حَتَّى جَلَسَ إلَى النَّبِيِّ صلى الله عليه و سلم . فَأَسْنَدَ رُكْبَتَيْهِ إلَى رُكْبَتَيْهِ، وَوَضَعَ كَفَّيْهِ عَلَى فَخِذَيْهِ، وَقَالَ: يَا مُحَمَّدُ أَخْبِرْنِي عَنْ الْإِسْلَامِ. فَقَالَ رَسُولُ اللَّهِ صلى الله عليه و سلم الْإِسْلَامُ أَنْ تَشْهَدَ أَنْ لَا إلَهَ إلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَتُقِيمَ الصَّلَاةَ، وَتُؤْتِيَ الزَّكَاةَ، وَتَصُومَ رَمَضَانَ، وَتَحُجَّ الْبَيْتَ إنْ اسْتَطَعْت إلَيْهِ سَبِيلًا. قَالَ: صَدَقْت . فَعَجِبْنَا لَهُ يَسْأَلُهُ وَيُصَدِّقُهُ! قَالَ: فَأَخْبِرْنِي عَنْ الْإِيمَانِ. قَالَ: أَنْ تُؤْمِنَ بِاَللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ وَالْيَوْمِ الْآخِرِ، وَتُؤْمِنَ بِالْقَدَرِ خَيْرِهِ وَشَرِّهِ. قَالَ: صَدَقْت. قَالَ: فَأَخْبِرْنِي عَنْ الْإِحْسَانِ. قَالَ: أَنْ تَعْبُدَ اللَّهَ كَأَنَّك تَرَاهُ، فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاك. قَالَ: فَأَخْبِرْنِي عَنْ السَّاعَةِ. قَالَ: مَا الْمَسْئُولُ عَنْهَا بِأَعْلَمَ مِنْ السَّائِلِ. قَالَ: فَأَخْبِرْنِي عَنْ أَمَارَاتِهَا؟ قَالَ: أَنْ تَلِدَ الْأَمَةُ رَبَّتَهَا، وَأَنْ تَرَى الْحُفَاةَ الْعُرَاةَ الْعَالَةَ رِعَاءَ الشَّاءِ يَتَطَاوَلُونَ فِي الْبُنْيَانِ. ثُمَّ انْطَلَقَ، فَلَبِثْتُ مَلِيًّا، ثُمَّ قَالَ: يَا عُمَرُ أَتَدْرِي مَنْ السَّائِلُ؟. ‫‬قُلْتُ: اللَّهُ وَرَسُولُهُ أَعْلَمُ. قَالَ: فَإِنَّهُ جِبْرِيلُ أَتَاكُمْ يُعَلِّمُكُمْ دِينَكُمْ ". [رَوَاهُ مُسْلِمٌ] .`;

    }

    // تخصيص النص للحديث رقم 24
    if (number === 24) {
        // يمكنك هنا إدخال النص المعدل يدويًا بدلاً من استرجاعه
        englishText = `On the authority of Abu Dharr al-Ghifaree (may Allah be pleased with him) from the Prophet (peace and blessings of Allah be upon him) from his Lord, that He said:
        O My servants! I have forbidden dhulm (oppression) for Myself, and I have made it forbidden amongst you, so do not oppress one another. O My servants, all of you are astray except those whom I have guided, so seek guidance from Me and I shall guide you. O My servants, all of you are hungry except those whom I have fed, so seek food from Me and I shall feed you. O My servants, all of you are naked except those whom I have clothed, so seek clothing from Me and I shall clothe you. O My servants, you commit sins by day and by night, and I forgive all sins, so seek forgiveness from Me and I shall forgive you. O My servants, you will not attain harming Me so as to harm Me, and you will not attain benefiting Me so as to benefit Me. O My servants, if the first of you and the last of you, and the humans of you and the jinn of you, were all as pious as the most pious heart of any individual amongst you, then this would not increase My Kingdom an iota. O My servants, if the first of you and the last of you, and the humans of you and the jinn of you, were all as wicked as the most wicked heart of any individual amongst you, then this would not decrease My Kingdom an iota. O My servants, if the first of you and the last of you, and the humans of you and the jinn of you, were all to stand together in one place and ask of Me, and I were to give everyone what he requested, then that would not decrease what I Possess, except what is decreased of the ocean when a needle is dipped into it. O My servants, it is but your deeds that I account for you, and then recompense you for. So he who finds good, let him praise Allah, and he who finds other than that, let him blame no one but himself. [Muslim]`;
    }

    return { arabic: arabicText, english: englishText };
};


// الدالة لعرض الحديث
const displayHadith = async () => {
    setRandomBackground(); // تعيين خلفية عشوائية
    
    const currentNumber = await getCurrentHadithNumber();
    const hadith = await getHadith(currentNumber);

    const arabicContainer = document.getElementById('hadith-arabic');
    const englishContainer = document.getElementById('hadith-english');

    if (arabicContainer && englishContainer) {
        arabicContainer.innerText = hadith.arabic;
        englishContainer.innerText = hadith.english;

        let nextNumber = currentNumber + 1;
        if (nextNumber > totalHadiths) nextNumber = 1;
        setCurrentHadithNumber(nextNumber);
    } else {
        console.error('Containers for displaying hadith not found.');
    }
};

displayHadith();
