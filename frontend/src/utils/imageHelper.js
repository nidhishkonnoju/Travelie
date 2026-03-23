// === Swiss Alps Ski Adventure ===
import swissAlps1 from '../assets/Swiss Alps Ski Adventure/Swiss Alps Ski Adventure.jpg';
import swissAlps2 from '../assets/Swiss Alps Ski Adventure/Skiers-on-the-way-to-ski-slope-in-Swiss-Alps-Ski-resort-zermatt-Matterhorn-Switzerland.jpg';
import swissAlps3 from '../assets/Swiss Alps Ski Adventure/TravelFromHome-to-the-Swiss-Alps-at-our-Virtual-Snow-Show.jpg';
import swissAlps4 from '../assets/Swiss Alps Ski Adventure/me-matterhorn-zermatt-iglu.1190x746.jpg';
import swissAlps5 from '../assets/Swiss Alps Ski Adventure/skifahren-bei-sonnenuntergang-zermatt-pascal-gertschen-welove2ski-990x660.jpg';

// === Santorini Sunset Retreat ===
import santorini1 from '../assets/Santorini Sunset Retreat/Santorini Sunset Retreat.jpg';
import santorini2 from '../assets/Santorini Sunset Retreat/433571205.jpg';
import santorini3 from '../assets/Santorini Sunset Retreat/75656756.jpg';
import santorini4 from '../assets/Santorini Sunset Retreat/hq720.jpg';
import santorini5 from '../assets/Santorini Sunset Retreat/n9223xi5pbx5fzw5figw.jpg';

// === Patagonia Wilderness Trek ===
import patagonia1 from '../assets/Patagonia Wilderness Trek/Patagonia Wilderness Trek.jpg';
import patagonia2 from '../assets/Patagonia Wilderness Trek/17733354183_08f1af2a83_b.jpg';
import patagonia3 from '../assets/Patagonia Wilderness Trek/64c8fc650f8c0123c006edf6_paulius-dragunas-14weKuGAe3I-unsplash copy.jpg';
import patagonia4 from '../assets/Patagonia Wilderness Trek/Hero-hiking-patagonia-adventure.jpg';
import patagonia5 from '../assets/Patagonia Wilderness Trek/W-Trek-Day-2-Ferry-across-Lago-Pehoe-5.jpg';

// === Morocco Desert Adventure ===
import morocco1 from '../assets/Morocco Desert Adventure/Morocco Desert Adventure.jpg';
import morocco2 from '../assets/Morocco Desert Adventure/126619_7ae7282e.jpg';
import morocco3 from '../assets/Morocco Desert Adventure/85.jpg';
import morocco4 from '../assets/Morocco Desert Adventure/Tour-from-Agadir-to-Merzouga.jpg';
import morocco5 from '../assets/Morocco Desert Adventure/morocco-desert-adventure-tour_WVE_4.jpeg';

// === Maldives Luxury Escape ===
import maldives1 from '../assets/Maldives Luxury Escape/Maldives.jpg';
import maldives2 from '../assets/Maldives Luxury Escape/4mdf9kid57dtmnhzuod.jpg';
import maldives3 from '../assets/Maldives Luxury Escape/8dtwz982du3923jpdql9.jpg';
import maldives4 from '../assets/Maldives Luxury Escape/9i45asnj8qt0w1rilt8k.jpg';
import maldives5 from '../assets/Maldives Luxury Escape/aerial-106208-crop.jpg';

// === Japan Cherry Blossom Tour ===
import japan1 from '../assets/Japan Cherry Blossom Tour/Japan Cherry Blossom Tour.jpg';
import japan2 from '../assets/Japan Cherry Blossom Tour/Japan-Cherry-Blossoms_252C-123rf.jpg';
import japan3 from '../assets/Japan Cherry Blossom Tour/kdkydwvgjymy6knfnnh0.jpg';
import japan4 from '../assets/Japan Cherry Blossom Tour/yozakura-japan_1.jpg';
import japan5 from '../assets/Japan Cherry Blossom Tour/yozakura-japan_10.jpg';

// === Iceland Northern Lights Hunt ===
import iceland1 from '../assets/Iceland Northern Lights Hunt/Iceland Northern Lights Hunt.jpg';
import iceland2 from '../assets/Iceland Northern Lights Hunt/Reykjavik Northern Lights Night Hunt with Chinese Guide.jpg';
import iceland3 from '../assets/Iceland Northern Lights Hunt/iceland-northern-lights-photography-tours.jpg';
import iceland4 from '../assets/Iceland Northern Lights Hunt/northern-lights-appear-over-mount-kirkjufell-iceland.jpg';
import iceland5 from '../assets/Iceland Northern Lights Hunt/northern-lights-kirkjufell-mountain-snaefellsnes-iceland-ICELANDLIGHTS1218-824f48715748425f828f05aa2a28dfe0.jpg';

// === Bali Cultural Odyssey ===
import bali1 from '../assets/Bali Cultural Odyssey/Bali Cultural Odyssey.jpg';
import bali2 from '../assets/Bali Cultural Odyssey/17-02-2026-07-55Cultural-Odyssey-Bali5.jpg';
import bali3 from '../assets/Bali Cultural Odyssey/17-02-2026-07-55Cultural-Odyssey-Bali7.jpg';
import bali4 from '../assets/Bali Cultural Odyssey/3d.jpg';
import bali5 from '../assets/Bali Cultural Odyssey/8a.jpg';
import bali6 from '../assets/Bali Cultural Odyssey/exploring-bali-257.png';

const imageMap = {
    'Swiss Alps Ski Adventure': [swissAlps1, swissAlps2, swissAlps3, swissAlps4, swissAlps5],
    'Santorini Sunset Retreat': [santorini1, santorini2, santorini3, santorini4, santorini5],
    'Patagonia Wilderness Trek': [patagonia1, patagonia2, patagonia3, patagonia4, patagonia5],
    'Morocco Desert Adventure': [morocco1, morocco2, morocco3, morocco4, morocco5],
    'Maldives Luxury Escape': [maldives1, maldives2, maldives3, maldives4, maldives5],
    'Japan Cherry Blossom Tour': [japan1, japan2, japan3, japan4, japan5],
    'Iceland Northern Lights Hunt': [iceland1, iceland2, iceland3, iceland4, iceland5],
    'Bali Cultural Odyssey': [bali1, bali2, bali3, bali4, bali5, bali6]
};

/** Returns the first (cover) image for a package title */
export const getPackageImage = (title) => {
    const images = imageMap[title];
    return images ? images[0] : null;
};

/** Returns all images for a package title (for carousel) */
export const getPackageImages = (title) => {
    return imageMap[title] || [];
};
