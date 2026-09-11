const fs = require('fs');

function replaceFile(path, replacer) {
  const content = fs.readFileSync(path, 'utf8');
  const newContent = replacer(content);
  if (newContent !== content) {
    fs.writeFileSync(path, newContent);
    console.log('Fixed', path);
  }
}

replaceFile('src/context/CartContext.jsx', c => c.replace('export const useCart = () => {', '// eslint-disable-next-line react-refresh/only-export-components\nexport const useCart = () => {'));
replaceFile('src/shop/CheckoutPage.jsx', c => c.replace('const { items, cartTotal, clearCart } = useCart();', 'const { items, cartTotal } = useCart();'));
replaceFile('src/shop/OrderTracking.jsx', c => c.replace('const [searched, setSearched] = useState(false);', '').replace('setSearched(true);', ''));
replaceFile('src/admin/shop/ProductManager.jsx', c => c.replace(/import \{ motion.*\} from 'framer-motion';/g, ''));
replaceFile('src/blog/BlogPage.jsx', c => c.replace(/import \{ motion.*\} from 'framer-motion';/g, ''));
replaceFile('src/components/GalleryLightbox.jsx', c => c.replace(/import \{ motion.*\} from 'framer-motion';/g, ''));

replaceFile('src/blog/BlogPost.jsx', c => {
  let cc = c.replace(/import \{ motion.*\} from 'framer-motion';/g, '');
  cc = cc.replace(/import \{ blogAPI.*\} from '\.\.\/services\/api';/, "import { normalizeAssetUrl } from '../services/api';");
  cc = cc.replace(/\} catch \(e\) \{/g, '} catch {');
  cc = cc.replace(/, \[post\]\);/g, ', [post, fetchComments]);');
  return cc;
});

replaceFile('src/components/AIChatbot.jsx', c => {
  let cc = c.replace(/import \{ motion.*\} from 'framer-motion';/g, '');
  cc = cc.replace(/catch \(e\) \{/g, 'catch {');
  return cc;
});
