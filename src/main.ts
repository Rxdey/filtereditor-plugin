import { createApp } from 'vue';
import App from './App.vue';
import priceInit from './price';
import './styles/color.css';


if (window.location.host === 'edit.filtereditor.cn') {
  createApp(App).mount(
    (() => {
      const app = document.createElement('div');
      document.body.append(app);
      return app;
    })(),
  );
}
if (window.location.host === 'price.filtereditor.cn') {
  priceInit();
}