/**
 * Contact form injector – builds and injects the contact form at runtime
 * so the form is the single source of truth and #contact styles apply.
 * Includes Cloudflare Turnstile widget (cf-turnstile-response submitted with form).
 * Run after DOMContentLoaded.
 */
(function () {
    'use strict';

    var FORM_ACTION = 'https://formsubmit.co/adam@ehsanalytical.com';
    var SUBJECT = 'Construction Safety Inquiry from constructionsafety.consulting';
    var SUBJECT_SERVICE = 'Construction Safety Consulting – Contact Request';
    var NEXT_URL = 'https://constructionsafety.consulting/?submitted=1';
    /** Cloudflare Turnstile site key. Override via data-turnstile-sitekey on #contact-form-inject. */
    var TURNSTILE_SITEKEY = '0x4AAAAAACM0oTMUbrZdORP7';

    var SERVICE_OPTIONS = [
        { value: '', label: 'Select a service...' },
        { value: 'SSHO Services', label: 'SSHO Services' },
        { value: 'Safety Representatives', label: 'Safety Representatives' },
        { value: 'Safety Program Development', label: 'Safety Program Development' },
        { value: 'Safety Training & Consulting', label: 'Safety Training & Consulting' },
        { value: 'Other', label: 'Other' }
    ];

    function el(tag, attrs, children) {
        var node = document.createElement(tag);
        if (attrs) {
            Object.keys(attrs).forEach(function (key) {
                if (key === 'className') node.className = attrs[key];
                else if (key === 'required' && attrs[key]) node.required = true;
                else if (typeof attrs[key] === 'boolean') node.setAttribute(key, attrs[key] ? '' : null);
                else if (attrs[key] != null && key !== 'required') node.setAttribute(key, attrs[key]);
            });
        }
        if (attrs && attrs.required) node.required = true;
        if (children && children.length) children.forEach(function (c) { node.appendChild(c); });
        return node;
    }

    function formGroup(labelFor, labelText, inputTag, inputAttrs, required) {
        var label = el('label', { for: labelFor }, [document.createTextNode(labelText)]);
        var input = el(inputTag, Object.assign({ id: labelFor, name: labelFor.replace('contact-', '') }, inputAttrs));
        if (required) input.required = true;
        var div = el('div', { className: 'form-group' }, [label, input]);
        return div;
    }

    function buildHomeForm() {
        var form = el('form', { className: 'contact-form', action: FORM_ACTION, method: 'POST', 'data-ih-injected': 'true' });
        form.appendChild(el('input', { type: 'hidden', name: '_subject', value: SUBJECT }));
        form.appendChild(el('input', { type: 'hidden', name: '_next', value: NEXT_URL }));
        form.appendChild(el('input', { type: 'hidden', name: '_captcha', value: 'false' }));

        var hp = el('div', { className: 'hp-field', 'aria-hidden': 'true' });
        hp.appendChild(el('label', { for: 'website' }, [document.createTextNode('Website')]));
        hp.appendChild(el('input', { type: 'text', name: 'website', id: 'website', tabindex: '-1', autocomplete: 'off' }));
        form.appendChild(hp);

        var row1 = el('div', { className: 'form-row' }, [
            formGroup('name', 'Name *', 'input', { type: 'text', placeholder: 'Your full name' }, true),
            formGroup('email', 'Email *', 'input', { type: 'email', placeholder: 'your@email.com' }, true)
        ]);
        var row2 = el('div', { className: 'form-row' }, [
            formGroup('phone', 'Phone *', 'input', { type: 'tel', placeholder: '(555) 123-4567' }, true),
            formGroup('company', 'Company', 'input', { type: 'text', placeholder: 'Your company name' }, false)
        ]);
        form.appendChild(row1);
        form.appendChild(row2);

        var serviceWrap = el('div', { className: 'form-group' });
        serviceWrap.appendChild(el('label', { for: 'service' }, [document.createTextNode('Service Interested In')]));
        var select = el('select', { id: 'service', name: 'service' });
        SERVICE_OPTIONS.forEach(function (opt) {
            select.appendChild(el('option', { value: opt.value }, [document.createTextNode(opt.label)]));
        });
        serviceWrap.appendChild(select);
        form.appendChild(serviceWrap);

        form.appendChild(formGroup('message', 'Message / Project Details *', 'textarea', { placeholder: 'Tell us about your project or inquiry...', rows: 5 }, true));

        var turnstileWrap = el('div', { id: 'contact-turnstile-container', className: 'contact-turnstile-wrap' });
        form.appendChild(turnstileWrap);
        form.appendChild(el('button', { type: 'submit', className: 'contact-submit' }, [document.createTextNode('Request Consultation')]));

        var note = el('p', { className: 'form-note' });
        note.appendChild(document.createTextNode('Or call us directly at '));
        var tel = el('a', { href: 'tel:6192883094' }, [document.createTextNode('(619) 288-3094')]);
        note.appendChild(tel);
        note.appendChild(document.createTextNode(' or email '));
        var mail = el('a', { href: 'mailto:adam@ehsanalytical.com' }, [document.createTextNode('adam@ehsanalytical.com')]);
        note.appendChild(mail);
        form.appendChild(note);

        return form;
    }

    function buildServiceForm() {
        var form = el('form', { id: 'contact-form', className: 'contact-form', action: FORM_ACTION, method: 'POST', 'data-ih-injected': 'true' });
        form.appendChild(el('input', { type: 'hidden', name: '_subject', value: SUBJECT_SERVICE }));
        form.appendChild(el('input', { type: 'hidden', name: '_captcha', value: 'false' }));
        form.appendChild(el('input', { type: 'hidden', name: '_next', value: NEXT_URL }));

        var hp = el('div', { className: 'hp-field', 'aria-hidden': 'true', style: 'position:absolute;left:-9999px;opacity:0;height:0;width:0;overflow:hidden;pointer-events:none;' });
        hp.appendChild(el('label', { for: 'contact-website' }, [document.createTextNode('Website')]));
        hp.appendChild(el('input', { type: 'text', name: 'website', id: 'contact-website', tabindex: '-1', autocomplete: 'off' }));
        form.appendChild(hp);

        ['Name *', 'Email *', 'Phone', 'Company'].forEach(function (item) {
            var parts = item.split(' ');
            var name = parts[0].toLowerCase();
            var id = 'contact-' + name;
            var required = item.indexOf('*') !== -1;
            var placeholder = name === 'name' ? 'Your name' : name === 'email' ? 'your@email.com' : name === 'phone' ? '(555) 123-4567' : 'Your company (optional)';
            var attrs = { type: name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'text', placeholder: placeholder };
            form.appendChild(formGroup(id, item, 'input', attrs, required));
        });

        form.appendChild(formGroup('contact-message', 'Message *', 'textarea', { placeholder: 'Describe your construction safety needs...', rows: 4 }, true));

        var turnstileWrap = el('div', { id: 'contact-turnstile-container', className: 'contact-turnstile-wrap' });
        form.appendChild(turnstileWrap);
        form.appendChild(el('button', { type: 'submit', className: 'btn-submit' }, [document.createTextNode('Submit Request')]));

        return form;
    }

    function renderTurnstile(container) {
        var sitekey = container.getAttribute('data-turnstile-sitekey') || TURNSTILE_SITEKEY;
        var widgetEl = document.getElementById('contact-turnstile-container');
        if (!widgetEl || typeof window.turnstile !== 'object') return;
        window.turnstile.ready(function () {
            window.turnstile.render(widgetEl, {
                sitekey: sitekey,
                theme: 'light',
                size: 'normal'
            });
        });
    }

    function showThankYou(form) {
        var ty = document.createElement('div');
        ty.className = 'form-message success';
        ty.style.padding = '2rem';
        ty.style.textAlign = 'center';
        ty.style.fontSize = '1.1rem';

        var h3 = document.createElement('h3');
        h3.style.marginBottom = '0.5rem';
        h3.textContent = 'Thank You!';

        var p = document.createElement('p');
        p.textContent = 'We\'ve received your inquiry and will respond within 24 hours.';

        var alt = document.createElement('p');
        alt.style.marginTop = '1rem';
        alt.style.fontSize = '0.95rem';
        alt.textContent = 'You can also reach us at (619) 288-3094 or adam@ehsanalytical.com';

        ty.appendChild(h3);
        ty.appendChild(p);
        ty.appendChild(alt);

        form.style.display = 'none';
        form.parentNode.insertBefore(ty, form);
    }

    function showFormError(container, form, btn, btnDefaultText, errMsg) {
        if (btn) { btn.disabled = false; btn.textContent = btnDefaultText; }
        var fullMsg = errMsg + ' You can also call (619) 288-3094 or email adam@ehsanalytical.com';
        var err = container.querySelector('.form-message.error');
        if (!err) {
            err = document.createElement('div');
            err.className = 'form-message error';
            err.textContent = fullMsg;
            form.parentNode.insertBefore(err, form);
        } else {
            err.textContent = fullMsg;
        }
    }

    function inject() {
        var container = document.getElementById('contact-form-inject');
        if (!container) return;

        var embedUrl = container.getAttribute('data-embed-url');
        if (embedUrl) {
            fetch(embedUrl, { mode: 'cors' })
                .then(function (r) { return r.text(); })
                .then(function (html) {
                    // Trusted source: ehsanalytical.com contact-embed endpoint
                    container.innerHTML = html;

                    // Ensure Turnstile has a container (embed may omit it if server has no key)
                    var form = container.querySelector('form');
                    var turnstileContainer = container.querySelector('#contact-turnstile-container, .cf-turnstile, [data-sitekey]');
                    if (form && !turnstileContainer) {
                        var wrap = document.createElement('div');
                        wrap.id = 'contact-turnstile-container';
                        wrap.className = 'contact-turnstile-wrap';
                        var btn = form.querySelector('button[type="submit"]');
                        if (btn) {
                            form.insertBefore(wrap, btn);
                        } else {
                            form.appendChild(wrap);
                        }
                    }

                    // Render Turnstile widget when API is ready (script may load after inject)
                    var sitekey = container.getAttribute('data-turnstile-sitekey') || TURNSTILE_SITEKEY;
                    var attempts = 0;
                    var maxAttempts = 50;
                    function renderTurnstileWhenReady() {
                        var w = container.querySelector('#contact-turnstile-container, .cf-turnstile, [data-sitekey]');
                        if (!w) return;
                        if (typeof window.turnstile === 'object') {
                            window.turnstile.ready(function () {
                                window.turnstile.render(w, { sitekey: sitekey, theme: 'light', size: 'normal' });
                            });
                            return;
                        }
                        attempts += 1;
                        if (attempts < maxAttempts) {
                            setTimeout(renderTurnstileWhenReady, 100);
                        }
                    }
                    renderTurnstileWhenReady();

                    // Intercept form submit – POST via fetch to embed URL, show inline TY
                    // Handles both JSON (WordPress AJAX mode) and HTML (fallback) responses
                    var form = container.querySelector('form');
                    if (form) {
                        form.addEventListener('submit', function (e) {
                            e.preventDefault();
                            var btn = form.querySelector('button[type="submit"]');
                            var btnDefaultText = btn ? btn.textContent : 'Submit Request';
                            if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

                            var formData = new FormData(form);
                            // Append ajax=1 to URL to signal WordPress this is an AJAX request
                            // Avoids X-Requested-With header which triggers CORS preflight
                            var postUrl = embedUrl + (embedUrl.indexOf('?') !== -1 ? '&' : '?') + 'ajax=1';
                            fetch(postUrl, { method: 'POST', body: formData, mode: 'cors' })
                                .then(function (r) {
                                    return r.text().then(function (text) {
                                        // Try JSON first (WordPress AJAX mode returns {"success":true})
                                        try {
                                            var data = JSON.parse(text);
                                            return { ok: r.ok, data: data, isJson: true };
                                        } catch (e) {
                                            // HTML response (WordPress didn't detect AJAX)
                                            return { ok: r.ok, html: text, isJson: false };
                                        }
                                    });
                                })
                                .then(function (result) {
                                    // JSON success
                                    if (result.isJson && result.data && result.data.success) {
                                        showThankYou(form);
                                        return;
                                    }
                                    // HTML response – check for error indicators
                                    if (!result.isJson && result.ok) {
                                        var hasError = result.html.indexOf('class="error"') !== -1;
                                        if (!hasError && result.html.indexOf('class="success"') !== -1) {
                                            // HTML success (contains success class, no error)
                                            showThankYou(form);
                                            return;
                                        }
                                        // HTML has error – extract error text if possible
                                        if (hasError) {
                                            var match = result.html.match(/<p class="error">([^<]+)<\/p>/);
                                            var errMsg = match ? match[1] : 'Submission failed. Please try again.';
                                            showFormError(container, form, btn, btnDefaultText, errMsg);
                                            return;
                                        }
                                    }
                                    // JSON error or unknown response
                                    if (btn) { btn.disabled = false; btn.textContent = btnDefaultText; }
                                    var errMsg = (result.isJson && result.data && result.data.error) ? result.data.error : 'Submission failed. Please try again.';
                                    showFormError(container, form, btn, btnDefaultText, errMsg);
                                })
                                .catch(function () {
                                    showFormError(container, form, btn, btnDefaultText, 'There was an error.');
                                });
                        });
                    }
                })
                .catch(function () {
                    injectBuiltForm(container);
                });
            return;
        }
        injectBuiltForm(container);
    }

    function injectBuiltForm(container) {
        container.innerHTML = '';
        var variant = (container.getAttribute('data-variant') || 'home').toLowerCase();
        var form = variant === 'service' ? buildServiceForm() : buildHomeForm();

        if (variant === 'service') {
            var h3 = el('h3', {}, [document.createTextNode('Send a message')]);
            container.appendChild(h3);
        }
        container.appendChild(form);

        // Fallback form: submit via fetch with redirect: 'manual' so we stay on page and show inline thank-you
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var btn = form.querySelector('button[type="submit"]');
            var btnDefaultText = btn ? btn.textContent : 'Submit Request';
            if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

            var formData = new FormData(form);
            fetch(FORM_ACTION, { method: 'POST', body: formData, redirect: 'manual' })
                .then(function (r) {
                    // FormSubmit.co returns 302 to _next; with redirect: 'manual' we get opaqueredirect or 302
                    if (r.type === 'opaqueredirect' || r.redirected || r.status === 302 || r.ok) {
                        showThankYou(form);
                        return;
                    }
                    if (btn) { btn.disabled = false; btn.textContent = btnDefaultText; }
                    showFormError(container, form, btn, btnDefaultText, 'Submission failed. Please try again.');
                })
                .catch(function () {
                    if (btn) { btn.disabled = false; btn.textContent = btnDefaultText; }
                    showFormError(container, form, btn, btnDefaultText, 'There was an error.');
                });
        });

        if (window.turnstile) {
            renderTurnstile(container);
        } else {
            window.addEventListener('load', function () { renderTurnstile(container); });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inject);
    } else {
        inject();
    }
})();

// Detect ?submitted=1 and show success message
(function() {
    if (window.location.search.indexOf('submitted=1') === -1) return;

    var contactSection = document.getElementById('contact');
    if (!contactSection) return;

    // Scroll to contact section
    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Show success message after a brief delay (allow form to render first)
    setTimeout(function() {
        var container = document.getElementById('contact-form-inject');
        if (!container) return;

        // Create success message
        var successMsg = document.createElement('div');
        successMsg.className = 'form-message success';
        successMsg.style.marginBottom = '20px';
        successMsg.textContent = 'Thank you! We\'ve received your inquiry and will respond within 24 hours.';

        // Insert at top of contact section
        container.insertBefore(successMsg, container.firstChild);

        // Optional: Hide the form after successful submission
        var form = container.querySelector('form');
        if (form) {
            form.style.display = 'none';
        }
    }, 500);
})();
