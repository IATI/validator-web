import { createRouter, createWebHistory } from 'vue-router';
import AboutPage from './pages/AboutPage.vue';
import HomePage from './pages/HomePage.vue';
import OrganisationPage from './pages/OrganisationPage.vue';
import OrganisationsPage from './pages/OrganisationsPage.vue';
import ReportPage from './pages/ReportPage.vue';
import ValidatePage from './pages/ValidatePage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/about', component: AboutPage },
  { path: '/validate', component: ValidatePage },
  { path: '/organisations', component: OrganisationsPage },
  { path: '/organisation/:name', component: OrganisationPage },
  { path: '/report/:id', component: ReportPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
