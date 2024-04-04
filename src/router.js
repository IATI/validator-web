import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './pages/HomePage.vue';
import NotFound from './pages/NotFound.vue';
import OrganisationPage from './pages/OrganisationPage.vue';
import OrganisationsPage from './pages/OrganisationsPage.vue';
import ReportPage from './pages/ReportPage.vue';
import ValidatePage from './pages/ValidatePage.vue';
import ValidationResult from './pages/ValidationResult.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/validate', component: ValidatePage },
  { path: '/validate/:tempWorkspaceID', component: ValidationResult },
  { path: '/organisations', component: OrganisationsPage },
  { path: '/organisation/:name', component: OrganisationPage },
  {
    path: '/view/dqf/files/:id',
    redirect: (to) => {
      return { path: `/report/${to.params.id}` };
    },
  },
  { path: '/report/:name', component: ReportPage },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

export default router;
