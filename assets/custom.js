// Faqs Toggling
jQuery(document).ready($ => {   

  // Homepage: making scroll to anchors to address section
  $(document).on('click', 'a', function(e){
    let hash = this.hash;
    let addressSectionID = '#shopify-section-template--17760546816047__custom_liquid_fGDpqr';
    if(hash == addressSectionID){
      e.preventDefault();
      let addressSection = $(addressSectionID);
      let offsetTop = Math.floor(addressSection.offset().top);
      let screenHeight = $(window).height();
      let oneFourthScreenHeight = screenHeight / 4;
      $('html, body').animate({
        scrollTop: offsetTop - oneFourthScreenHeight
      }); 
    }
  });

  // Mobile only Js
  // Removing 'active' class on equipment toggles on plans in mobile screens
  if($(window).width() <= 767){
    var collapser = document.getElementsByClassName("feature_item_collapser");
    var i;
    if(collapser.length){
        for (i = 0; i < collapser.length; i++) {
          collapser[i].querySelector('.faq-dropdown-symbol').innerHTML = "+";
        }
        let activeCollapser = document.querySelectorAll('.features_collapsible_item.active');
        activeCollapser.forEach( function(element, index) {
          let itemContent = element.querySelector('.features_collapsible_item_content');
          collapseElement(itemContent);
          element.classList.remove('active');
        });
      
    }
  }

  

  // Adding class 'page-width' to FAQs
  jQuery('.collapsible-content-wrapper-narrow').addClass('page-width');

  // FAQ page, making all faq items collapsible
  $(document).on('click', '.collapsible-content__wrapper:not(.section-template--17760546816047__collapsible_content_g8QBEC-padding) .collapsible-content__header', function () {
    $(this).parent().toggleClass('activeFaq').find('.collapsible-content__grid').slideToggle();
  });

  // SUMMARY product total amount calculation
  // Adding simple input(checkboxes) in place of addons real checkboxes to not get selected for payment processing
  let input = `<input type="checkbox" class="addon_option_checkbox" style="display: block;" />`;
  $(`.ef__product-option[data-option-title="Add-ons"] .ef__option-value.ef__option-value-checkbox`).prepend(input);

  // Setting data-is-in-cart attribute to true on page load for proper working
  $('input[data-value-title="Yes, I need help with installation."]').attr('data-is-in-cart', true);

  // Installation options(inputs)
  $(document).on('change', 'div.ef__product-option[data-option-title="Do you need installation for your satellite kit?"] input.ef__product-option-input[type="radio"]', function(){
    let $this = $(this),
		inputWrapper = $this.closest('.ef__option-value'),
		optionWrapper = $this.closest('.ef__option-values'),
		optionSetWrapper = $this.closest('.ef__product-option'),
		easyFlowWrapper = $this.closest('.ef__product-option-root'),
      	selectedOption = $this.data('value-title'),
		productMainPrice = +$(`.summary_row_recurring ul li .product_summary_item_price > span`).text(),
      	yesOptionTitle = `Yes, I need help with installation.`,
      	noOptionTitle = `No, I don't require installation.`,
		addonsWrapper = $('.ef__product-option[data-option-title="Add-ons"]'),
		addonCheckboxes = addonsWrapper.find('input.ef__product-option-input'),
		checkedAddons = addonsWrapper.find('input.ef__product-option-input:checked'),
		addonCheckboxesFake = addonsWrapper.find('input.addon_option_checkbox'),
		checkedAddonsFake = addonsWrapper.find('input.addon_option_checkbox:checked'),
		paylaterOption = easyFlowWrapper.find('textarea.ef__product-option-input[name="Pay Later Payments"]'),
		yesInstallationCheckbox = optionWrapper.find('input[data-value-title="Yes, I need help with installation."]'),
		isInCart = Boolean(yesInstallationCheckbox.attr('data-is-in-cart')),
		summaryOneTime = $('.summary_row_one_time ul'),
		summaryOneTimeTotal = $('.product_summary_total_one_time strong > span'),
		summaryPaylater = $(`.summary_row_pay_later ul`),
		summaryPaylaterTotal = $('.product_summary_total_pay_later strong > span'),
		summaryFooterOneTime = $(`#summary_footer_price_one_time`),
		summaryTotalDueToday = $('.psf_row_total_due_today h3 > span');

	var paylaterData = ``,
		summaryPaylaterHTML = summaryPaylater.html();


    let depositOptionName = `Installation Deposit`;
    let remainingOptionName = `Balance Fees for Satellite Equipment`;
    let remainingOptionPrice = + $('.included_equipments_price').data('equipment-price');
    
    if(selectedOption == yesOptionTitle){
		// Paylater data
		paylaterData = `${remainingOptionName}:$${remainingOptionPrice}, `;
		// Show fake checkboxes on top of original checkboxes (overlapped) and shift the checked state
		addonCheckboxesFake.show();
		checkedAddons.each((i, input) => {
			let $this = $(input),
				title = $this.data('value-title'),
				price = +$this.data('value-price') / 100;

			// Paylater data
			paylaterData += `${title}:$${price}, `;
			$this.prop('checked', false).trigger('change').parent().find('input.addon_option_checkbox').prop('checked', true).trigger('change');

		});

      	let depositOptionPrice = + (($(this).data('value-price')) / 100);
      	let summaryListItem_one_time = `<li class="product_summary_item" data-title="${depositOptionName}">
											<h5 class="product_summary_item_name">${depositOptionName}</h5>
											<h5 class="product_summary_item_price">$<span>${depositOptionPrice}</span></h5>
										</li>`;
      	let summaryListItem_pay_later = `<li class="product_summary_item pay_later_list_item" data-title="${remainingOptionName}">
											<h5 class="product_summary_item_name">${remainingOptionName}</h5>
											<h5 class="product_summary_item_price">$<span>${remainingOptionPrice}</span><br><span class="pay_later_text">Pay later</span></h5>
										</li>`;
		

      	// Insert deposit option in one time payment row
      	let onetime_items_html = summaryOneTime.html();
      	summaryOneTime.html(summaryListItem_one_time);

		let selectedEquipmentOption = summaryOneTime.find(`li[data-title="${remainingOptionName}"]`);
		let selectedEquipmentPrice = +selectedEquipmentOption.find('span:first-child').text();
		selectedEquipmentOption.remove();
		
		// Insert remaining deposit option in pay later payment row
		summaryPaylater.html(onetime_items_html).closest('.summary_row_pay_later').show();

		
		// Calculating sub total(total one time)
		let total_one_time_old = +summaryOneTimeTotal.text();
		let new_total_one_time = +(depositOptionPrice + total_one_time_old) - selectedEquipmentPrice;
		summaryOneTimeTotal.text(depositOptionPrice);
		summaryFooterOneTime.text(depositOptionPrice);

		// Calculating sub total(pay later)
		let total_pay_later_old = +summaryPaylaterTotal.text();
		let new_total_pay_later = +(total_pay_later_old + remainingOptionPrice);
		summaryPaylaterTotal.text(total_one_time_old);
		
		// Total Due Today
		let total_due_old = +summaryTotalDueToday.text();
		let new_total_due = +(depositOptionPrice + productMainPrice);
		// let new_total_due = +(depositOptionPrice + total_due_old) - selectedEquipmentPrice;
		summaryTotalDueToday.text(new_total_due);


		summaryPaylater.find(`li span.pay_later_text`).show();
		$(`.item_name_equipment`).hide();
		$(`.item_name_equipment_paylater`).show();

		// Set paylater data in Paylater product option to send to it to backend
		paylaterOption.text(paylaterData).val(paylaterData).attr('data-value', paylaterData);

		// Last line
		$this.attr('data-is-in-cart', true);
		
    }else if(selectedOption == noOptionTitle){
		// Hide fake addon checkboxes and shift their checked state to original checkboxes
		checkedAddonsFake.each((i, input) => {
			$(input).prop('checked', false).trigger('change').parent().find('input.ef__product-option-input').prop('checked', true).trigger('change');
		});
		addonCheckboxesFake.hide();

	  	// Reset paylater data in Paylater product option to stop sending it to backend
		paylaterOption.text('').val('').attr('data-value', '');      
		
		if(isInCart){
			let remainingOptionPrice = +summaryPaylater.find(`li[data-title="${remainingOptionName}"] .product_summary_item_price span:first-child`).text();
			// summaryOneTime.find(`li[data-title="${depositOptionName}"]`).remove();

			// let summaryListItem = `<li class="product_summary_item" data-title="${remainingOptionName}">
			// 							<h5 class="product_summary_item_name">${remainingOptionName}</h5>
			// 							<h5 class="product_summary_item_price">$<span>${remainingOptionPrice}</span></h5>
			// 						</li>`;


			// summaryOneTime.append(summaryListItem);
			
			// Calculating sub total(total one time)
			let depositOptionPrice =  yesInstallationCheckbox.data('value-price');
			depositOptionPrice = +(depositOptionPrice / 100);
			let total_one_time_old = +summaryOneTimeTotal.text();
			let new_total_one_time = +(total_one_time_old - depositOptionPrice) + remainingOptionPrice;
			summaryOneTimeTotal.text(new_total_one_time);
			summaryFooterOneTime.text(new_total_one_time);

			// Calculating sub total(total pay later)
			let total_pay_later_old = +summaryPaylaterTotal.text();
			let total_selected_addons_price = 0;
			// Removing selected addon price from the pay later row total
			let addonOptions = summaryPaylater.find(`li .product_summary_item_price span:not(.pay_later_text)`);
			addonOptions.each((i, v, a) => {
				let checkedOptionPrice = +$(v).text();
				total_selected_addons_price += checkedOptionPrice;  
			});
			let new_total_pay_later = +(total_pay_later_old - total_selected_addons_price);
			summaryPaylaterTotal.text(new_total_pay_later);
			
			// summaryPaylater.find(`li[data-title="${remainingOptionName}"]`).remove();
			// let selected_paylater_items_html = summaryPaylater.html();
      		// HTML
			summaryOneTime.html(summaryPaylaterHTML);
			let selected_addons_price = +(total_selected_addons_price - remainingOptionPrice);
			let total_one_time_old_2 = +summaryOneTimeTotal.text();
			let new_one_time_total = +(total_one_time_old_2 + selected_addons_price);
			summaryOneTimeTotal.text(new_one_time_total);
			// summaryFo .text(new_one_time_total);

			// let total_due_old = +$('.psf_row_total_due_today h3 > span').text();
			let newTotalDue = +(productMainPrice + new_one_time_total);
			$('.psf_row_total_due_today h3 > span').text(newTotalDue);
			
			summaryPaylater.empty().parent('.summary_row_pay_later').hide();
			summaryOneTime.find(`li span.pay_later_text`).hide();

			$(`.item_name_equipment`).show();
			$(`.item_name_equipment_paylater`).hide();
			// Last line
			yesInstallationCheckbox.attr('data-is-in-cart', false);
		}
    }
  });

  // Addon options(inputs)
  $(document).on('change', 'div.ef__product-option[data-option-title="Add-ons"] input.ef__product-option-input[type="checkbox"]', function(){
	let $this = $(this),
    rowOneTimePayment = $('.summary_row_one_time'),
		isChecked = $this.is(':checked'),
		checkedOptionName = $this.data('value-title'),
		checkedOptionPrice = +(($this.data('value-price')) / 100),
		installationCustomer = $('input.ef__product-option-input[type="radio"][data-value-title="Yes, I need help with installation."]').is(':checked'),
    productTitle = $('a.product__title h2').first().text().trim();
	if(isChecked){
    if(productTitle == 'Fibre Daily Go'){
      rowOneTimePayment.show();
    }
		let summaryListItem = `<li class="product_summary_item" data-title="${checkedOptionName}">
                              <h5 class="product_summary_item_name">${checkedOptionName}<br><span>Add-on</span></h5>
                              <h5 class="product_summary_item_price">$<span>${checkedOptionPrice}</span><br><span class="pay_later_text">Pay later</span></h5>
                            </li>`;
		
		if(installationCustomer){
			
			$('.summary_row_pay_later ul').append(summaryListItem);

			// Calculating sub total(total pay later)
			let total_pay_later = +$('.product_summary_total_pay_later strong > span').text();
			let new_total_pay_later = +(checkedOptionPrice + total_pay_later);
			$('.product_summary_total_pay_later strong > span').text(new_total_pay_later);
		}else{
			$('.summary_row_one_time ul').append(summaryListItem);
			$('.summary_row_one_time ul .pay_later_text').hide();
			let total_due_old = +$('.psf_row_total_due_today h3 > span').text();
			let new_total_due = +(checkedOptionPrice + total_due_old);
			$('.psf_row_total_due_today h3 > span').text(new_total_due);
			
			// Calculating sub total(total one time)
			let total_one_time_old = +$('.product_summary_total_one_time strong > span').text();
			let new_total_one_time = +(checkedOptionPrice + total_one_time_old);
			$('.product_summary_total_one_time strong > span').text(new_total_one_time);
			$(`#summary_footer_price_one_time`).text(new_total_one_time);
		}
	}else{
    if(productTitle == 'Fibre Daily Go'){
      rowOneTimePayment.hide();
    }
		if(installationCustomer){
			$(`.summary_row_pay_later ul li[data-title="${checkedOptionName}"]`).remove();

			// Calculating sub total(total pay later)
			let total_pay_later = +$('.product_summary_total_pay_later strong > span').text();
			let new_total_pay_later = +(total_pay_later - checkedOptionPrice);
			$('.product_summary_total_pay_later strong > span').text(new_total_pay_later);
		}else{
			$(`.summary_row_one_time ul li[data-title="${checkedOptionName}"]`).remove();
			let total_due_old = +$('.psf_row_total_due_today h3 > span').text();
			let new_total_due = +(total_due_old - checkedOptionPrice);
			$('.psf_row_total_due_today h3 > span').text(new_total_due);

			// Calculating sub total(total one time)
			let total_one_time_old = +$('.product_summary_total_one_time strong > span').text();
			let new_total_one_time = +(total_one_time_old - checkedOptionPrice);
			$('.product_summary_total_one_time strong > span').text(new_total_one_time);
			$(`#summary_footer_price_one_time`).text(new_total_one_time);
		}		
	}
  });

  
  // Fake addon checkboxes, add/remove their values to summary and paylater field on change
  	$(document).on('change', '.ef__product-option[data-option-title="Add-ons"] .ef__option-value.ef__option-value-checkbox input.addon_option_checkbox', function(){
	  let $this = $(this),
      isChecked = $this.is(':checked'),
      optionWrapper = $this.parent(),
      easyFlowWrapper = $this.closest('.ef__product-option-root'),
      totalPaylaterOld = +$(`.product_summary_total_pay_later > strong > span`).text(),
      paylaterOption = easyFlowWrapper.find('textarea.ef__product-option-input[name="Pay Later Payments"]'),
      oldPaylaterItems = paylaterOption.val().trim(),
      summaryPaylater = $('.summary_row_pay_later ul'),
      summaryPaylaterTotal = $(`.product_summary_total_pay_later > strong > span`),
      optionTitle = optionWrapper.find('input[class~="ef__product-option-input"]').data('value-title'),
      optionPrice = +(optionWrapper.find('input[class~="ef__product-option-input"]').data('value-price') / 100),
		newPaylaterItems = '';

    if(isChecked){
      newPaylaterItems = `${optionTitle}:$${optionPrice}, `;
      let summaryListItem = `<li class="product_summary_item" data-title="${optionTitle}">
                              <h5 class="product_summary_item_name">${optionTitle}<br><span>Add-on</span></h5>
                              <h5 class="product_summary_item_price">$<span>${optionPrice}</span><br><span class="pay_later_text">Pay later</span></h5>
                            </li>`;
      summaryPaylater.append(summaryListItem);
      let totalPaylaterNew = +(totalPaylaterOld + optionPrice);
      summaryPaylaterTotal.text(totalPaylaterNew);
      if(oldPaylaterItems){
        oldPaylaterItems = oldPaylaterItems.split(',');
        $.each(oldPaylaterItems, (i, item) => {
          let option = item.trim();
          if(option){
            let optionItems = option.split(':'),
              optionName = optionItems[0].trim(),
              optionPrice = optionItems[1].trim(),
              checkedOptionTitle = optionTitle;
            if(checkedOptionTitle != optionName){
              newPaylaterItems += `${optionName}:${optionPrice}, `;				
            }
            
          }
        });
      }
        // Set paylater data in Paylater product option to send to it to backend
      paylaterOption.text(newPaylaterItems).val(newPaylaterItems).attr('data-value', newPaylaterItems);

    }else{
      let totalPaylaterNew = +(totalPaylaterOld - optionPrice);
      $(`.product_summary_total_pay_later > strong > span`).text(totalPaylaterNew);
      $(`.summary_row_pay_later ul > li.product_summary_item[data-title="${optionTitle}"]`).remove();
      
      newPaylaterItems = ``;
    if(oldPaylaterItems){
        oldPaylaterItems = oldPaylaterItems.split('/');
        $.each(oldPaylaterItems, (i, item) => {
          let option = item.trim();
          if(option){
            let optionItems = option.split(':'),
              optionName = optionItems[0].trim(),
              optionPrice = optionItems[1].trim(),
              checkedOptionTitle = optionTitle;
            if(checkedOptionTitle != optionName){
              newPaylaterItems += `${optionName}:${optionPrice}, `;
            }
            
          }
        });
	}
	  	// Set paylater data in Paylater product option to send to it to backend
		paylaterOption.text(newPaylaterItems).val(newPaylaterItems).attr('data-value', newPaylaterItems);
    }
  });
  
  // Expanding/Collapsing summary in mobile view
  $(document).on(`click`, `#summaryExpanderBtn`, function(){
    $(`#product_summary`).addClass(`summary_expanded`);
  });
  $(document).on(`click`, `#summaryCollapserBtn`, function(){
    $(`#product_summary`).removeClass(`summary_expanded`);
  });

  // Wrapping product title and product price with subscription to make it group with border on product page
  jQuery('.product__info-container > .product__title, .product__info-container > #price-template--17760546979887__main').wrapAll('<div class="product_page_product_price_info"></div>');

  // Setting session to store summary html on product page to send it to cart page on click of add_to_cart button(Text: Buy Now)
  $(document).on('click', '.product-form__buttons button', function(e) {
    let summary_html = $('#product_summary').html().trim();
    localStorage.setItem('summary_html', summary_html);
  });

  let summary_html = localStorage.getItem('summary_html');
  let summar_cartpage = $('.cart_page_summary');
  summar_cartpage.html(summary_html);
  let checkoutBtn = `<div class="cartpage_footer_checkout_btn_area">
                        <div class="cartpage_checkout_btn_wrap">
                          <a href="/checkout" class="cartpage_checkout_btn button">Checkout</a>
                        </div>
                      </div>`;
  $('.cart_page_summary .psf_row_button_buynow').html(checkoutBtn);

   // Slicing addon price example, (+$999.00) => +$999
   setTimeout(function(){
	jQuery('.ef__option-value-price').each((i, addon) => {
		let addonPrice = jQuery(addon).text();
		if(addonPrice){
			if(addonPrice.trim().endsWith(')')){
				let addonPriceSliced = addonPrice.slice(2, -4);
				jQuery(addon).text(addonPriceSliced);
			} 
		}
	});
   }, 2 * 1000);
  
  setTimeout(() => {
    jQuery('.subify-original-price').each((i, addon) => {
      let addonPrice = jQuery(addon).text();
      if(addonPrice){
        let addonPriceSliced = addonPrice.slice(0, -3);
        jQuery(addon).text(addonPriceSliced);
      }
    });
  }, 3 * 1000);
  
  // Toggling installtion type collaper on cart page for VDSL product
  $(document).on('click', 'install_type_collapser', function(){
    $(this).closest('div.cart_item_row_wrap').find('.vdsl_installation_options').slideToggle();
  });

  // JavaScript
  var acc = document.getElementsByClassName("faq-question");
  var i;
  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      } 
    });
  }
   
  // Collapser
  $(document).on('click', '.feature_item_collapser', function(){
    this.parentElement.classList.toggle("active");
    var panel = this.nextElementSibling;
    collapseElement(panel);
    if(this.parentElement.classList.contains('active')){
      this.querySelector('.faq-dropdown-symbol').innerHTML = "-";
    }else{
      this.querySelector('.faq-dropdown-symbol').innerHTML = "+";
    }
  });
  var collapser = document.getElementsByClassName("feature_item_collapser");
  var i;
  if(collapser.length){
      let activeCollapser = document.querySelectorAll('.features_collapsible_item.active .features_collapsible_item_content');
      activeCollapser.forEach( function(element, index) {
         collapseElement(element);
      }); 
  }
  
  function collapseElement(element){
      if (element.style.maxHeight) {
        element.style.maxHeight = null;
      } else {
        element.style.maxHeight = element.scrollHeight + "px";
      }
  }

  // CART PAGE INSTALL TYPE CUSTOM DROPDOWN
  const dropdowns = document.querySelectorAll(".install_type_dropdown");
  let cartNoteElement = document.getElementById('Cart-note');
  dropdowns.forEach(dropdown => {
    const selectedOption = dropdown.querySelector(".selected-option");
    const options = dropdown.querySelector(".dropdown-options");
    // Toggle dropdown
    selectedOption.addEventListener("click", function () {
      options.style.display = options.style.display === "block" ? "none" : "block";
    });
  
    // Select an option
    options.querySelectorAll("li").forEach(option => {
      option.addEventListener("click", function () {
        let clickedVal = option.querySelector("span:first-child").textContent;
        selectedOption.innerHTML = `${clickedVal} <span class="installtype_charge_val">${option.querySelector(".installtype_charge_val").textContent}</span>`;
        const cartTotal = document.getElementById('cart_total_price');
        let cartTotalAmount = parseFloat(cartTotal.textContent);
        const hiddenInput = this.closest('.install_type_dropdown').querySelector("#install-type-input");
        let lastSelectedChargePrice = parseFloat(hiddenInput.value);
        let newSelectedChargePrice = parseFloat(this.getAttribute("data-price"));
        cartTotalAmount = cartTotalAmount - lastSelectedChargePrice;
        cartTotalAmount = cartTotalAmount + newSelectedChargePrice;
        cartTotal.textContent = cartTotalAmount;
        hiddenInput.value = clickedVal;
        options.style.display = "none";

        // Setting selected option's value in ORDER NOTE field to get proccessed automatically through 
        // cartNoteElement.value = `${cartNoteElement.value}, ${clickedVal}`;
      });
    });
  
    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {
      if (!dropdown.contains(event.target)) {
        options.style.display = "none";
      }
    });  
  });


  // Fetching add-on product's info to display on frontend on product page
  // Utility to slugify product title into handle format
  function slugify(str) {
    return str.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  
  // const variantInputs = document.querySelectorAll('.ef__product-option-input[data-variant-id]');
  // if (variantInputs.length) {
  //   variantInputs.forEach(input => {
  //     const variantGid = input.dataset.variantId;
  //     if (!variantGid) return;
  
  //     const variantId = variantGid.split('/').pop();
  
  //     fetch(`/variants/${variantId}.js`)
  //       .then(res => res.json())
  //       .then(variant => {
  //         const productName = variant.name; // e.g. "Installation - Default Title"
  //         const baseTitle = productName.split(' - ')[0]; // "Installation"
  //         const handle = slugify(baseTitle); // "installation"
  
  //         return fetch(`/products/${handle}.js`);
  //       })
  //       .then(res => res.json())
  //       .then(product => {
  //         const title = product.title;
  //         const description = product.description;
  //         const image = product.images[0] || '';
  //         const slug = slugify(title);
  
  //         const addonInfo = document.createElement('div');
  //         addonInfo.className = 'addon-info';
  //         addonInfo.innerHTML = `
  //           <div class="addon_info_wrapper addon_${slug}">
  //             ${image ? `<img class="addon_img" src="${image}" alt="${title}" />` : ''}
  //             ${description ? description : ''}
  //           </div>`;
  
  //         const parent = input.closest('.ef__option-value');
  //         if (parent) parent.append(addonInfo);
  //       })
  //       .catch(err => {
  //         console.warn('Could not load full product info for variant ID:', variantId, err);
  //       });
  //   });
  // }

  // Claude.ai
  const variantInputs = document.querySelectorAll('.ef__product-option-input[data-variant-id]');
  if (variantInputs.length) {
    variantInputs.forEach(input => {
      const variantGid = input.dataset.variantId;
      if (!variantGid) return;

      const variantId = variantGid.split('/').pop();

      fetch(`/variants/${variantId}.js`)
        .then(res => res.json())
        .then(variant => {
          const productName = variant.name; // e.g. "Installation - Default Title"
          const baseTitle = productName.split(' - ')[0]; // "Installation"
          const handle = slugify(baseTitle); // "installation"

          return fetch(`/products/${handle}.js`)
            .then(res => {
              if (!res.ok) {
                // If the slugified handle doesn't work, try getting product from variant
                console.warn(`Product not found at /products/${handle}.js, trying variant product_id`);
                
                // Use the product_id from the variant instead
                if (variant.product_id) {
                  return fetch(`/products.json?ids=${variant.product_id}`)
                    .then(r => r.json())
                    .then(data => data.products[0]);
                }
                throw new Error(`Product not found for handle: ${handle}`);
              }
              return res.json();
            });
        })
        .then(product => {
          if (!product) return; // Skip if no product found

          const title = product.title;
          const description = product.description;
          const image = product.images[0] || '';
          const slug = slugify(title);

          const addonInfo = document.createElement('div');
          addonInfo.className = 'addon-info';
          addonInfo.innerHTML = `
            <div class="addon_info_wrapper addon_${slug}">
              ${image ? `<img class="addon_img" src="${image}" alt="${title}" />` : ''}
              ${description ? description : ''}
            </div>`;

          const parent = input.closest('.ef__option-value');
          if (parent) parent.append(addonInfo);
        })
        .catch(err => {
          console.warn('Could not load full product info for variant ID:', variantId, err);
        });
    });
  }

  // Set paylater data in Paylater product option to send to it to backend
  let summaryPaylaterEquipment = $('.summary_row_pay_later ul li:first-child'),
    optionPrice = summaryPaylaterEquipment.data('price'),
    optionName = summaryPaylaterEquipment.find('.item_name_equipment_paylater').text().trim(),
    paylaterItem = `${optionName}:$${optionPrice}, `;
  $(`textarea.ef__product-option-input[name="Pay Later Payments"]`).text(paylaterItem).val(paylaterItem).attr('data-value', paylaterItem);

  // Disabling / Enable update cart button on PREFERRED DATE CHANGE
  jQuery('#cart_date, #Cart-note').on('change', function(){
    let $this = $(this),
      val = $this.val(),
      updateCartBtn = $('#updateCartBtn');
    if(val){
      updateCartBtn.prop('disabled', false);
    }else{
      updateCartBtn.prop('disabled', true);
    }
  });

  
  
}); // end .ready() %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// Add this to your custom.js
document.addEventListener('DOMContentLoaded', function() {
  const productForm = document.querySelector('form[action="/cart/add"]');
  
  if (productForm) {
    console.log('Form found');
    productForm.addEventListener('submit', function(e) {
      // Check if installation is selected
      const installationInput = document.querySelector('.ef__product-option-input:checked[data-variant-id]');
      console.log('Installation input', installationInput);
      if (installationInput) {
        e.preventDefault(); // Stop normal form submission
        
        const mainVariantId = document.querySelector('input[name="id"]').value;
        const addonVariantGid = installationInput.dataset.variantId;
        const addonVariantId = addonVariantGid.split('/').pop();
        
        // Add both items to cart
        const items = [
          {
            id: mainVariantId,
            quantity: 1,
            selling_plan: document.querySelector('input[name="selling_plan"]')?.value
          },
          {
            id: addonVariantId,
            quantity: 1
          }
        ];
        
        // Use Shopify AJAX Cart API
        fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ items: items })
        })
        .then(response => response.json())
        .then(data => {
          console.log('Added to cart:', data);
          // Redirect to cart
          window.location.href = '/cart';
        })
        .catch((error) => {
          console.error('Error:', error);
          // Allow form to submit normally as fallback
          productForm.submit();
        });
      } else {
        // No add-on selected, allow normal form submission
        return true;
      }
    });
  }else{
    console.log('Form not found');
  }
});
