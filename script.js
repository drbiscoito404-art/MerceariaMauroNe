const state = { user: null, adminUnlocked: false, data: null };

const elements = {
  pages: document.querySelectorAll('.page'),
  navButtons: document.querySelectorAll('.nav-button'),
  productList: document.getElementById('product-list'),
  cartPanel: document.getElementById('cart-panel'),
  employeeList: document.getElementById('employee-list'),
  adminPanel: document.getElementById('admin-panel'),
  adminLockPanel: document.getElementById('admin-lock-panel'),
  adminLockMessage: document.getElementById('admin-lock-message'),
  authMessage: document.getElementById('auth-message'),
  adminCodeInput: document.getElementById('admin-code-input'),
  adminUnlockButton: document.getElementById('admin-unlock-button'),
  adminProductList: document.getElementById('admin-product-list'),
  adminEmployeeList: document.getElementById('admin-employee-list'),
  changeLocationForm: document.getElementById('change-location-form'),
  userWelcome: document.getElementById('user-welcome'),
  logoutButton: document.getElementById('logout-button'),
  cartToggle: document.getElementById('cart-toggle'),
  cartBadge: document.getElementById('cart-badge'),
  cartClose: document.getElementById('cart-close'),
  cartDropdown: document.getElementById('cart-dropdown'),
  cartSummary: document.getElementById('cart-summary'),
  cartDropdownContent: document.getElementById('cart-dropdown-content'),
  adminMessage: document.getElementById('admin-message'),
  loginForm: document.getElementById('login-form'),
  loginName: document.getElementById('login-name'),
  loginEmail: document.getElementById('login-email'),
  registerForm: document.getElementById('register-form'),
  registerEmail: document.getElementById('register-email'),
  registerName: document.getElementById('register-name'),
  registerPassword: document.getElementById('register-password'),
  registerConfirmPassword: document.getElementById('register-confirm-password'),
  addProductForm: document.getElementById('add-product-form'),
  addEmployeeForm: document.getElementById('add-employee-form'),
  changeCodeForm: document.getElementById('change-code-form'),
};

function showPage(pageId) {
  elements.pages.forEach(page => page.classList.toggle('active', page.id === pageId));
  elements.navButtons.forEach(button => button.classList.toggle('active', button.dataset.target === pageId));
}

async function fetchState() {
  const response = await fetch('/api/state');
  if (!response.ok) return null;
  const data = await response.json();
  state.data = data;
  return data;
}

function saveSession(user) {
  localStorage.setItem('mercearia-user', JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem('mercearia-user');
}

async function restoreSession() {
  const saved = localStorage.getItem('mercearia-user');
  if (!saved) return;
  try {
    const user = JSON.parse(saved);
    const email = user.email || user.username;
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: user.name, email, password: user.password }),
    });
    if (!response.ok) {/* Line 72 omitted */}
    const res = await response.json();
    const loggedEmail = res.email;
    const name = res.name || user.name || user.username || '';
    state.user = { name, email: loggedEmail, cart: res.cart || [], password: user.password };
    state.data = state.data || await fetchState();
    updateUserInfo();
    renderCart();
  } catch (err) {
    clearSession();
  }
}

function updateUserInfo() {
  if (state.user) {
    const display = state.user.name ? `${state.user.name}` : 'Conta';
    /* Lines 88-92 omitted */
  } else {/* Lines 93-98 omitted */}
}

function updateCartBadge() {
  if (!state.user || !elements.cartBadge) /* Line 102 omitted */
  const total = state.user.cart?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  if (total <= 0) {/* Lines 105-107 omitted */} else {/* Lines 108-110 omitted */}
}

function closeCartDropdown() {
  elements.cartDropdown.classList.add('hidden');
}

function toggleCartDropdown() {
  elements.cartDropdown.classList.toggle('hidden');
}

function renderCartDropdown() {
  const summary = elements.cartSummary;
  const content = elements.cartDropdownContent;
  summary.innerHTML = '';
  content.innerHTML = '';
  if (!state.user) {/* Lines 127-131 omitted */}

  const total = state.user.cart?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  summary.innerHTML = `
    <div class="cart-summary-box">
      <h4>Valor estimado</h4>
      <p><strong>${formatCurrency(total)}</strong></p>
      <p class="cart-summary-note">O valor fica fixado enquanto você vê e ajusta os itens.</p>
    </div>
  `;

  if (!state.user.cart || state.user.cart.length === 0) {/* Lines 143-146 omitted */}

  const list = document.createElement('div');
  list.className = 'cart-items';
  state.user.cart.forEach(item => {/* Lines 151-166 omitted */});
  content.appendChild(list);
  updateCartBadge();
}

async function saveProductEdit(id, card) {
  if (!card) /* Line 172 omitted */
  const name = card.querySelector('[data-field="product-name"]').value.trim();
  const price = Number(card.querySelector('[data-field="product-price"]').value);
  const quantity = Number(card.querySelector('[data-field="product-quantity"]').value);
  const promotion = card.querySelector('[data-field="product-promotion"]').value.trim();
  if (!name) {/* Lines 178-180 omitted */}
  const response = await fetch(`/api/merchandise/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price, quantity, promotion }),
  });
  const result = await response.json();
  if (!response.ok) {/* Lines 188-190 omitted */}
  await updateData();
  showAdminMessage('Mercadoria atualizada com sucesso.', 'success');
}

async function removeProduct(id) {
  const response = await fetch(`/api/merchandise/${encodeURIComponent(id)}`, { method: 'DELETE' });
  if (!response.ok) {/* Lines 198-201 omitted */}
  await updateData();
  showAdminMessage('Mercadoria removida.', 'success');
}

async function saveEmployeeEdit(id, card) {
  if (!card) /* Line 207 omitted */
  const name = card.querySelector('[data-field="employee-name"]').value.trim();
  const role = card.querySelector('[data-field="employee-role"]').value.trim();
  const imageUrl = card.querySelector('[data-field="employee-image"]').value.trim();
  if (!name || !role) {/* Lines 212-214 omitted */}
  const response = await fetch(`/api/employee/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, role, imageUrl }),
  });
  const result = await response.json();
  if (!response.ok) {/* Lines 222-224 omitted */}
  await updateData();
  showAdminMessage('Funcionário atualizado com sucesso.', 'success');
}

async function removeEmployee(id) {
  const response = await fetch(`/api/employee/${encodeURIComponent(id)}`, { method: 'DELETE' });
  if (!response.ok) {/* Lines 232-235 omitted */}
  await updateData();
  showAdminMessage('Funcionário removido.', 'success');
}

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function renderProducts() {
  elements.productList.innerHTML = '';
  if (!state.data) /* Line 250 omitted */
  if (state.data.merchandise.length === 0) {/* Lines 252-254 omitted */}
  state.data.merchandise.forEach(item => {/* Lines 256-266 omitted */});
}

function renderEmployees() {
  elements.employeeList.innerHTML = '';
  if (!state.data) /* Line 271 omitted */
  if (state.data.employees.length === 0) {/* Lines 273-275 omitted */}
  state.data.employees.forEach(emp => {/* Lines 277-291 omitted */});
}

function renderCart() {
  renderCartDropdown();
}

function renderAdminLists() {
  elements.adminProductList.innerHTML = '';
  elements.adminEmployeeList.innerHTML = '';
  if (!state.data) /* Line 301 omitted */
  if (state.data.merchandise.length === 0) {/* Lines 303-304 omitted */} else {/* Lines 305-320 omitted */}

  if (state.data.employees.length === 0) {/* Lines 323-324 omitted */} else {/* Lines 325-344 omitted */}
}

function showMessage(text, target, type = 'error') {
  target.textContent = text;
  target.classList.toggle('success', type === 'success');
  target.classList.toggle('error', type !== 'success');
  setTimeout(() => {/* Line 351 omitted */}, 5000);
}

function showAdminMessage(text, type = 'error') {
  const target = elements.adminMessage;
  if (!target) /* Line 356 omitted */
  target.textContent = text;
  target.classList.toggle('success', type === 'success');
  target.classList.toggle('error', type !== 'success');
  setTimeout(() => {/* Line 360 omitted */}, 5000);
}

function renderLocation() {
  const locationText = document.getElementById('location-text');
  const locationDescription = document.getElementById('location-description');
  const serviceDescription = document.getElementById('service-description');
  if (!state.data) /* Line 367 omitted */
  if (locationText) /* Line 368 omitted */
  if (locationDescription) /* Line 369 omitted */
  if (serviceDescription) /* Line 370 omitted */
}

async function updateData() {
  await fetchState();
  renderProducts();
  renderEmployees();
  renderAdminLists();
  renderLocation();
}

async function doLogin(event) {
  event.preventDefault();
  const name = elements.loginName ? elements.loginName.value.trim() : '';
  const email = elements.loginEmail.value.trim();
  const password = document.getElementById('login-password').value;
  if (!name) {/* Line 386 omitted */}
  if (!isValidEmail(email)) {/* Line 387 omitted */}
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const result = await response.json();
  if (!response.ok) {/* Lines 395-397 omitted */}
  state.user = { name: result.name || name, email: result.email, password, cart: result.cart || [] };
  saveSession(state.user);
  updateUserInfo();
  renderCart();
  showMessage('Login realizado com sucesso.', elements.authMessage, 'success');
}

async function doRegister(event) {
  event.preventDefault();
  const email = elements.registerEmail.value.trim();
  const name = elements.registerName ? elements.registerName.value.trim() : '';
  const password = elements.registerPassword.value;
  const confirmPassword = elements.registerConfirmPassword.value;
  if (!name) {/* Lines 412-414 omitted */}
  if (!isValidEmail(email)) {/* Lines 416-418 omitted */}
  if (password.length < 6) {/* Lines 420-422 omitted */}
  if (password !== confirmPassword) {/* Lines 424-426 omitted */}
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const result = await response.json();
  if (!response.ok) {/* Lines 434-436 omitted */}
  state.user = { name: result.name || name, email: result.email, password, cart: result.cart || [] };
  saveSession(state.user);
  updateUserInfo();
  renderCart();
  showMessage('Conta criada com sucesso.', elements.authMessage, 'success');
}

async function unlockAdmin(event) {
  event.preventDefault();
  const code = elements.adminCodeInput.value.trim();
  const response = await fetch('/api/admin-unlock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  if (!response.ok) {/* Lines 453-456 omitted */}
  state.adminUnlocked = true;
  elements.adminPanel.classList.remove('hidden');
  elements.adminLockPanel.classList.add('hidden');
  showMessage('Acesso admin liberado.', elements.adminLockMessage);
}

async function addProduct(event) {
  event.preventDefault();
  const name = document.getElementById('product-name').value.trim();
  const price = Number(document.getElementById('product-price').value);
  const quantity = Number(document.getElementById('product-quantity').value);
  const promotion = document.getElementById('product-promotion').value.trim();
  const response = await fetch('/api/merchandise', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price, quantity, promotion }),
  });
  if (!response.ok) {/* Lines 475-478 omitted */}
  await updateData();
  event.target.reset();
}

async function addEmployee(event) {
  event.preventDefault();
  const name = document.getElementById('employee-name').value.trim();
  const role = document.getElementById('employee-role').value.trim();
  const imageUrl = document.getElementById('employee-image')?.value.trim() || '';
  const response = await fetch('/api/employee', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, role, imageUrl }),
  });
  if (!response.ok) {/* Lines 494-497 omitted */}
  await updateData();
  event.target.reset();
}

async function changeCode(event) {
  event.preventDefault();
  const code = document.getElementById('new-admin-code').value.trim();
  const response = await fetch('/api/admin-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  if (!response.ok) {/* Lines 511-514 omitted */}
  showAdminMessage('Código administrativo atualizado.', 'success');
  event.target.reset();
}

async function changeLocation(event) {
  event.preventDefault();
  const location = document.getElementById('new-location').value.trim();
  const description = document.getElementById('location-description-input')?.value.trim();
  const serviceDescription = document.getElementById('service-description-input')?.value.trim();
  const response = await fetch('/api/location', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ location, locationDescription: description, serviceDescription }),
  });
  if (!response.ok) {/* Lines 530-533 omitted */}
  await updateData();
  showAdminMessage('Localização atualizada com sucesso.', 'success');
  event.target.reset();
}

async function handleRootClicks(event) {
  const addButton = event.target.closest('.add-cart');
  if (addButton) {/* Lines 542-572 omitted */}

  const cartQtyButton = event.target.closest('.qty-button');
  if (cartQtyButton && cartQtyButton.dataset.id) {/* Lines 576-613 omitted */}

  const removeButton = event.target.closest('.remove-button');
  if (removeButton && removeButton.dataset.id) {/* Lines 617-628 omitted */}

  const adminActionButton = event.target.closest('button[data-admin-action]');
  if (adminActionButton) {/* Lines 632-644 omitted */}
}

async function logout() {
  state.user = null;
  clearSession();
  updateUserInfo();
  renderCart();
}

async function init() {
  elements.navButtons.forEach(button => button.addEventListener('click', () => showPage(button.dataset.target)));
  elements.loginForm.addEventListener('submit', doLogin);
  elements.registerForm.addEventListener('submit', doRegister);
  elements.adminUnlockButton.addEventListener('click', unlockAdmin);
  elements.cartToggle.addEventListener('click', toggleCartDropdown);
  elements.cartClose.addEventListener('click', closeCartDropdown);
  document.addEventListener('click', event => {/* Lines 662-665 omitted */});
  elements.addProductForm.addEventListener('submit', addProduct);
  elements.addEmployeeForm.addEventListener('submit', addEmployee);
  elements.changeCodeForm.addEventListener('submit', changeCode);
  elements.changeLocationForm.addEventListener('submit', changeLocation);
  elements.logoutButton.addEventListener('click', logout);
  document.body.addEventListener('click', handleRootClicks);
  await fetchState();
  await restoreSession();
  updateUserInfo();
  renderProducts();
  renderEmployees();
  renderCart();
  renderAdminLists();
  renderLocation();
}

init();
const state = { user: null, adminUnlocked: false, data: null };

const elements = {
  pages: document.querySelectorAll('.page'),
  navButtons: document.querySelectorAll('.nav-button'),
  productList: document.getElementById('product-list'),
  cartPanel: document.getElementById('cart-panel'),
  employeeList: document.getElementById('employee-list'),
  adminPanel: document.getElementById('admin-panel'),
  adminLockPanel: document.getElementById('admin-lock-panel'),
  adminLockMessage: document.getElementById('admin-lock-message'),
  authMessage: document.getElementById('auth-message'),
  adminCodeInput: document.getElementById('admin-code-input'),
  adminUnlockButton: document.getElementById('admin-unlock-button'),
  adminProductList: document.getElementById('admin-product-list'),
  adminEmployeeList: document.getElementById('admin-employee-list'),
  changeLocationForm: document.getElementById('change-location-form'),
  userWelcome: document.getElementById('user-welcome'),
  logoutButton: document.getElementById('logout-button'),
  cartToggle: document.getElementById('cart-toggle'),
  cartBadge: document.getElementById('cart-badge'),
  cartClose: document.getElementById('cart-close'),
  cartDropdown: document.getElementById('cart-dropdown'),
  cartSummary: document.getElementById('cart-summary'),
  cartDropdownContent: document.getElementById('cart-dropdown-content'),
  adminMessage: document.getElementById('admin-message'),
  loginForm: document.getElementById('login-form'),
  loginName: document.getElementById('login-name'),
  loginEmail: document.getElementById('login-email'),
  registerForm: document.getElementById('register-form'),
  registerEmail: document.getElementById('register-email'),
  registerName: document.getElementById('register-name'),
  registerPassword: document.getElementById('register-password'),
  registerConfirmPassword: document.getElementById('register-confirm-password'),
  addProductForm: document.getElementById('add-product-form'),
  addEmployeeForm: document.getElementById('add-employee-form'),
  changeCodeForm: document.getElementById('change-code-form'),
};

function showPage(pageId) {
  elements.pages.forEach(page => page.classList.toggle('active', page.id === pageId));
  elements.navButtons.forEach(button => button.classList.toggle('active', button.dataset.target === pageId));
}

async function fetchState() {
  const response = await fetch('/api/state');
  if (!response.ok) return null;
  const data = await response.json();
  state.data = data;
  return data;
}

function saveSession(user) {
  localStorage.setItem('mercearia-user', JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem('mercearia-user');
}

async function restoreSession() {
  const saved = localStorage.getItem('mercearia-user');
  if (!saved) return;
  try {
    const user = JSON.parse(saved);
    const email = user.email || user.username;
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: user.name, email, password: user.password }),
    });
    if (!response.ok) {/* Line 72 omitted */}
    const res = await response.json();
    const loggedEmail = res.email;
    const name = res.name || user.name || user.username || '';
    state.user = { name, email: loggedEmail, cart: res.cart || [], password: user.password };
    state.data = state.data || await fetchState();
    updateUserInfo();
    renderCart();
  } catch (err) {
    clearSession();
  }
}

function updateUserInfo() {
  if (state.user) {
    const display = state.user.name ? `${state.user.name}` : 'Conta';
    /* Lines 88-92 omitted */
  } else {/* Lines 93-98 omitted */}
}

function updateCartBadge() {
  if (!state.user || !elements.cartBadge) /* Line 102 omitted */
  const total = state.user.cart?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  if (total <= 0) {/* Lines 105-107 omitted */} else {/* Lines 108-110 omitted */}
}

function closeCartDropdown() {
  elements.cartDropdown.classList.add('hidden');
}

function toggleCartDropdown() {
  elements.cartDropdown.classList.toggle('hidden');
}

function renderCartDropdown() {
  const summary = elements.cartSummary;
  const content = elements.cartDropdownContent;
  summary.innerHTML = '';
  content.innerHTML = '';
  if (!state.user) {/* Lines 127-131 omitted */}

  const total = state.user.cart?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  summary.innerHTML = `
    <div class="cart-summary-box">
      <h4>Valor estimado</h4>
      <p><strong>${formatCurrency(total)}</strong></p>
      <p class="cart-summary-note">O valor fica fixado enquanto você vê e ajusta os itens.</p>
    </div>
  `;

  if (!state.user.cart || state.user.cart.length === 0) {/* Lines 143-146 omitted */}

  const list = document.createElement('div');
  list.className = 'cart-items';
  state.user.cart.forEach(item => {/* Lines 151-166 omitted */});
  content.appendChild(list);
  updateCartBadge();
}

async function saveProductEdit(id, card) {
  if (!card) /* Line 172 omitted */
  const name = card.querySelector('[data-field="product-name"]').value.trim();
  const price = Number(card.querySelector('[data-field="product-price"]').value);
  const quantity = Number(card.querySelector('[data-field="product-quantity"]').value);
  const promotion = card.querySelector('[data-field="product-promotion"]').value.trim();
  if (!name) {/* Lines 178-180 omitted */}
  const response = await fetch(`/api/merchandise/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price, quantity, promotion }),
  });
  const result = await response.json();
  if (!response.ok) {/* Lines 188-190 omitted */}
  await updateData();
  showAdminMessage('Mercadoria atualizada com sucesso.', 'success');
}

async function removeProduct(id) {
  const response = await fetch(`/api/merchandise/${encodeURIComponent(id)}`, { method: 'DELETE' });
  if (!response.ok) {/* Lines 198-201 omitted */}
  await updateData();
  showAdminMessage('Mercadoria removida.', 'success');
}

async function saveEmployeeEdit(id, card) {
  if (!card) /* Line 207 omitted */
  const name = card.querySelector('[data-field="employee-name"]').value.trim();
  const role = card.querySelector('[data-field="employee-role"]').value.trim();
  const imageUrl = card.querySelector('[data-field="employee-image"]').value.trim();
  if (!name || !role) {/* Lines 212-214 omitted */}
  const response = await fetch(`/api/employee/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, role, imageUrl }),
  });
  const result = await response.json();
  if (!response.ok) {/* Lines 222-224 omitted */}
  await updateData();
  showAdminMessage('Funcionário atualizado com sucesso.', 'success');
}

async function removeEmployee(id) {
  const response = await fetch(`/api/employee/${encodeURIComponent(id)}`, { method: 'DELETE' });
  if (!response.ok) {/* Lines 232-235 omitted */}
  await updateData();
  showAdminMessage('Funcionário removido.', 'success');
}

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function renderProducts() {
  elements.productList.innerHTML = '';
  if (!state.data) /* Line 250 omitted */
  if (state.data.merchandise.length === 0) {/* Lines 252-254 omitted */}
  state.data.merchandise.forEach(item => {/* Lines 256-266 omitted */});
}

function renderEmployees() {
  elements.employeeList.innerHTML = '';
  if (!state.data) /* Line 271 omitted */
  if (state.data.employees.length === 0) {/* Lines 273-275 omitted */}
  state.data.employees.forEach(emp => {/* Lines 277-291 omitted */});
}

function renderCart() {
  renderCartDropdown();
}

function renderAdminLists() {
  elements.adminProductList.innerHTML = '';
  elements.adminEmployeeList.innerHTML = '';
  if (!state.data) /* Line 301 omitted */
  if (state.data.merchandise.length === 0) {/* Lines 303-304 omitted */} else {/* Lines 305-320 omitted */}

  if (state.data.employees.length === 0) {/* Lines 323-324 omitted */} else {/* Lines 325-344 omitted */}
}

function showMessage(text, target, type = 'error') {
  target.textContent = text;
  target.classList.toggle('success', type === 'success');
  target.classList.toggle('error', type !== 'success');
  setTimeout(() => {/* Line 351 omitted */}, 5000);
}

function showAdminMessage(text, type = 'error') {
  const target = elements.adminMessage;
  if (!target) /* Line 356 omitted */
  target.textContent = text;
  target.classList.toggle('success', type === 'success');
  target.classList.toggle('error', type !== 'success');
  setTimeout(() => {/* Line 360 omitted */}, 5000);
}

function renderLocation() {
  const locationText = document.getElementById('location-text');
  const locationDescription = document.getElementById('location-description');
  const serviceDescription = document.getElementById('service-description');
  if (!state.data) /* Line 367 omitted */
  if (locationText) /* Line 368 omitted */
  if (locationDescription) /* Line 369 omitted */
  if (serviceDescription) /* Line 370 omitted */
}

async function updateData() {
  await fetchState();
  renderProducts();
  renderEmployees();
  renderAdminLists();
  renderLocation();
}

async function doLogin(event) {
  event.preventDefault();
  const name = elements.loginName ? elements.loginName.value.trim() : '';
  const email = elements.loginEmail.value.trim();
  const password = document.getElementById('login-password').value;
  if (!name) {/* Line 386 omitted */}
  if (!isValidEmail(email)) {/* Line 387 omitted */}
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const result = await response.json();
  if (!response.ok) {/* Lines 395-397 omitted */}
  state.user = { name: result.name || name, email: result.email, password, cart: result.cart || [] };
  saveSession(state.user);
  updateUserInfo();
  renderCart();
  showMessage('Login realizado com sucesso.', elements.authMessage, 'success');
}

async function doRegister(event) {
  event.preventDefault();
  const email = elements.registerEmail.value.trim();
  const name = elements.registerName ? elements.registerName.value.trim() : '';
  const password = elements.registerPassword.value;
  const confirmPassword = elements.registerConfirmPassword.value;
  if (!name) {/* Lines 412-414 omitted */}
  if (!isValidEmail(email)) {/* Lines 416-418 omitted */}
  if (password.length < 6) {/* Lines 420-422 omitted */}
  if (password !== confirmPassword) {/* Lines 424-426 omitted */}
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const result = await response.json();
  if (!response.ok) {/* Lines 434-436 omitted */}
  state.user = { name: result.name || name, email: result.email, password, cart: result.cart || [] };
  saveSession(state.user);
  updateUserInfo();
  renderCart();
  showMessage('Conta criada com sucesso.', elements.authMessage, 'success');
}

async function unlockAdmin(event) {
  event.preventDefault();
  const code = elements.adminCodeInput.value.trim();
  const response = await fetch('/api/admin-unlock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  if (!response.ok) {/* Lines 453-456 omitted */}
  state.adminUnlocked = true;
  elements.adminPanel.classList.remove('hidden');
  elements.adminLockPanel.classList.add('hidden');
  showMessage('Acesso admin liberado.', elements.adminLockMessage);
}

async function addProduct(event) {
  event.preventDefault();
  const name = document.getElementById('product-name').value.trim();
  const price = Number(document.getElementById('product-price').value);
  const quantity = Number(document.getElementById('product-quantity').value);
  const promotion = document.getElementById('product-promotion').value.trim();
  const response = await fetch('/api/merchandise', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price, quantity, promotion }),
  });
  if (!response.ok) {/* Lines 475-478 omitted */}
  await updateData();
  event.target.reset();
}

async function addEmployee(event) {
  event.preventDefault();
  const name = document.getElementById('employee-name').value.trim();
  const role = document.getElementById('employee-role').value.trim();
  const imageUrl = document.getElementById('employee-image')?.value.trim() || '';
  const response = await fetch('/api/employee', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, role, imageUrl }),
  });
  if (!response.ok) {/* Lines 494-497 omitted */}
  await updateData();
  event.target.reset();
}

async function changeCode(event) {
  event.preventDefault();
  const code = document.getElementById('new-admin-code').value.trim();
  const response = await fetch('/api/admin-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  if (!response.ok) {/* Lines 511-514 omitted */}
  showAdminMessage('Código administrativo atualizado.', 'success');
  event.target.reset();
}

async function changeLocation(event) {
  event.preventDefault();
  const location = document.getElementById('new-location').value.trim();
  const description = document.getElementById('location-description-input')?.value.trim();
  const serviceDescription = document.getElementById('service-description-input')?.value.trim();
  const response = await fetch('/api/location', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ location, locationDescription: description, serviceDescription }),
  });
  if (!response.ok) {/* Lines 530-533 omitted */}
  await updateData();
  showAdminMessage('Localização atualizada com sucesso.', 'success');
  event.target.reset();
}

async function handleRootClicks(event) {
  const addButton = event.target.closest('.add-cart');
  if (addButton) {/* Lines 542-572 omitted */}

  const cartQtyButton = event.target.closest('.qty-button');
  if (cartQtyButton && cartQtyButton.dataset.id) {/* Lines 576-613 omitted */}

  const removeButton = event.target.closest('.remove-button');
  if (removeButton && removeButton.dataset.id) {/* Lines 617-628 omitted */}

  const adminActionButton = event.target.closest('button[data-admin-action]');
  if (adminActionButton) {/* Lines 632-644 omitted */}
}

async function logout() {
  state.user = null;
  clearSession();
  updateUserInfo();
  renderCart();
}

async function init() {
  elements.navButtons.forEach(button => button.addEventListener('click', () => showPage(button.dataset.target)));
  elements.loginForm.addEventListener('submit', doLogin);
  elements.registerForm.addEventListener('submit', doRegister);
  elements.adminUnlockButton.addEventListener('click', unlockAdmin);
  elements.cartToggle.addEventListener('click', toggleCartDropdown);
  elements.cartClose.addEventListener('click', closeCartDropdown);
  document.addEventListener('click', event => {/* Lines 662-665 omitted */});
  elements.addProductForm.addEventListener('submit', addProduct);
  elements.addEmployeeForm.addEventListener('submit', addEmployee);
  elements.changeCodeForm.addEventListener('submit', changeCode);
  elements.changeLocationForm.addEventListener('submit', changeLocation);
  elements.logoutButton.addEventListener('click', logout);
  document.body.addEventListener('click', handleRootClicks);
  await fetchState();
  await restoreSession();
  updateUserInfo();
  renderProducts();
  renderEmployees();
  renderCart();
  renderAdminLists();
  renderLocation();
}

init();
