jQuery(document).ready($ => {
    
    // Store original slider HTML in localStorage
    let plansSlider = $('#Slider-template--17760546816047__feature_collection_bE6h9P');
    if (plansSlider.length){
        localStorage.setItem('originalPlansSlides', plansSlider.html());
    }

    // Init slick slider on plans
    const sliderSettings = {
        autoplay: false,
        arrows: true,
        dots: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: false,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    arrows: false,
                    dots: true,
                }
            }, 
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    arrows: false,
                    dots: true,
                }
            }
        ]
    };
    plansSlider.slick(sliderSettings);
    // JS for Map section
    // let addressSearchbox = jQuery('input.address-search-box');
    $(document).on('change', 'input.address-search-box', function(){
        let $input = $(this),
            loader = $('#addresssFinderLoader');
        if(!loader.hasClass('loading')){
            loader.addClass('loading').fadeIn();
        }
        
        setTimeout(() => {
            let widgetTechnologies = $input.closest('.primary-panel').find('.availability-status');
            const availableTechnologies = [];
            widgetTechnologies.each((i, v) => {
                if($(v).find('.status-available').length > 0){
                    let allClasses = $(v).closest('.available-technology').attr('class').split(' ');
                    let availablePlanName = allClasses[1].split('-');
                    availablePlanName = availablePlanName[2].toLowerCase();
                    availableTechnologies.push(availablePlanName);                    
                }
            });
            let availableTechnology = availableTechnologies[0];
        
            const $planSlider = $(`#Slider-template--17760546816047__feature_collection_bE6h9P`);
            $planSlider.slick(`slickUnfilter`);
            $planSlider.slick(`slickFilter`, function(){
                let $slide = $(this),                
                plan = $slide.find('.plan'),
                checkAddressBtn = plan.find('.planCheckAddressBtn'),
                buyNowBtn = plan.find('.plan_buy_now_btn'),
                planTechnology = plan.data('technology').toLowerCase(),
                isAvailable = planTechnology == availableTechnology;
                if(planTechnology != 'satellite'){
                    if(isAvailable){
                        checkAddressBtn.slideUp();
                        buyNowBtn.slideDown();
                    }else{
                        checkAddressBtn.slideDown();
                        buyNowBtn.slideUp();
                    }
                }
                // isAvailable = planTechnology == 'satellite' || planTechnology == availableTechnology;
                
                return isAvailable;
            });
            $(`.plans_filter_btn:not([data-technology="satellite"], [data-technology=""])`).show().not(`[data-technology="${availableTechnology}"]`).hide()
            // $(`.plans_filter_btn`).show().not(`[data-technology="${availableTechnology}"], [data-technology="satellite"], [data-technology=""]`).hide()

            // Remove active class from all buttons
            $(`.plans_filter_btn:not([data-technology=""])`).removeClass('active');

            // Add active class on just clicked button
            $(`.plans_filter_btn[data-technology=""]`).addClass('active');
            
            let availableTechnologiesString = availableTechnologies.join(':');

            $('.plans_filter_btns').attr('data-available-technologies', availableTechnologiesString);
            
            if(availableTechnologies.length){
                $('#selected-results').removeClass('satellite_only');
            }else{
                $('#selected-results').addClass('satellite_only');
            }

            // Populate the address details and status
            let selectedAddress = $input.val();
            $('#selected_address').html(selectedAddress);
        
            loader.removeClass('loading').fadeOut();
            $('#selected-results').removeClass('tech_failure').addClass('tech_success').slideDown();
            $('.address-search').fadeOut();

            // Filter the plans
            filterPlans($('.plans_filter_btn.active'));

        }, 6000);        
    });

    // JS for click of Change address button
    $(document).on('click', '.change-address', function(){
        $('.plan .planCheckAddressBtn').slideDown().text('Check Address');
        $('.plan .plan_buy_now_btn').not($('.satellite_buy_btn')).slideUp();
        $('#selected-results').slideUp();
        $('.address-search').fadeIn();
        $('input#address').val('').attr('value', '').focus();

        $(`.plans_filter_btn`).show().removeClass('active').filter('[data-target="all"]').addClass('active');
        const $planSlider = $(`#Slider-template--17760546816047__feature_collection_bE6h9P`);
        $planSlider.slick(`slickUnfilter`);
        $('.plans_filter_btns').attr('data-available-technologies', '');
    });

    // // Plans filter on homepage
  	// $(document).on('click', '.plans_filter_btn', function(){
    // 	let $this = $(this),
	// 		target = $this.data('target').trim().toLowerCase(),
	// 		section = $this.closest('section'),
	// 		plans = section.find('.plan'),
	// 		sliderComponent = section.find('slider-component'),
	// 		plansLoader = sliderComponent.find('#plansLoader');
	// 	plansLoader.slideDown();
	// 	$('.plans_filter_btn').not($this).removeClass('active');
	// 	$this.addClass('active');

	// 	let plansSlider = $('ul.product-grid.slick-initialized');
	// 	plansSlider.slick('slickUnfilter');
    //     if(target != 'all'){
    //         plansSlider.slick('slickFilter', function() {
    //             let filter = $(this).find('.plan').data('filter').trim().toLowerCase();
    //             return filter == target;
    //         });
    //     }
    //   setTimeout(e => plansLoader.slideUp(), 1 * 1000);
  	// });

    // DeepSeek
    // Plans filter on homepage
    // Plans filter on homepage - Robust localStorage approach
    $(document).on('click', '.plans_filter_btn', function(){
        filterPlans($(this));
    });

    function filterPlans(filterBtn){
        let $this = filterBtn,
            btnsWrapper = $this.parent(),
            target = $this.data('target').trim().toLowerCase(),
            technology = $this.data('technology'),
            section = $this.closest('section'),
            plansLoader = section.find('#plansLoader'),
            availableTechnologies = btnsWrapper.attr('data-available-technologies');
            if(availableTechnologies){
                availableTechnologies = availableTechnologies.split(':');
            }else{
                availableTechnologies = [];
            }
        
        plansLoader.slideDown();
        $('.plans_filter_btn').removeClass('active');
        $this.addClass('active');

        let plansSlider = $('#Slider-template--17760546816047__feature_collection_bE6h9P');
        let sliderContainer = plansSlider.parent();
        
        try {
            // Get original slides from localStorage
            let originalSlidesHTML = localStorage.getItem('originalPlansSlides');
            
            if (!originalSlidesHTML) {
                // Fallback: store current slides if not in localStorage
                originalSlidesHTML = plansSlider.html();
                localStorage.setItem('originalPlansSlides', originalSlidesHTML);
            }
            
            // Destroy current slick
            if (plansSlider.hasClass('slick-initialized')) {
                plansSlider.slick('unslick');
            }
            
            // Parse HTML and filter
            let $tempContainer = $('<div>').html(originalSlidesHTML);
            let $filteredItems;
            
            if (target === 'all') {
                $filteredItems = $tempContainer.children();
            } else {
                $filteredItems = $tempContainer.find('.grid__item').filter(function() {
                    let planFilter = $(this).find('.plan').data('filter').trim().toLowerCase();
                    return planFilter === target;
                });
            }
            
            // Clear and rebuild
            plansSlider.empty();
            
            if ($filteredItems.length > 0) {
                plansSlider.append($filteredItems.clone());
                console.log('Filtered plans', plansSlider.children());
                plansSlider.find('.plan').each((i, plan) => {
                    let checkAddressBtn = $(plan).find('.planCheckAddressBtn'),
                        buyNowBtn = $(plan).find('.plan_buy_now_btn');
                    if(technology == ''){
                        if(!($(plan).data('technology') == 'satellite')){
                            if(availableTechnologies.length){
                                checkAddressBtn.slideUp();
                                buyNowBtn.slideDown();
                            }else{
                                checkAddressBtn.slideDown();
                                buyNowBtn.slideUp();
                            }
                        }
                    }else{
                        if(!($(plan).data('technology') == 'satellite')){
                            if(availableTechnologies.length && availableTechnologies.includes(technology)){
                                checkAddressBtn.slideUp();
                                buyNowBtn.slideDown();
                            }else{
                                checkAddressBtn.slideDown();
                                buyNowBtn.slideUp();
                            }
                        }
                    }
                    
                    
                    
                });
                // Reinitialize slick
                setTimeout(() => {
                    let slideCount = $filteredItems.length;
                    
                    plansSlider.slick(sliderSettings);
                    
                    plansLoader.slideUp();
                }, 50);
            } else {
                // No slides found for this filter
                plansSlider.html('<li class="grid__item"><div class="no-plans-message">No plans found for this filter</div></li>');
                plansLoader.slideUp();
            }
            
        } catch (error) {
            console.error('Error filtering plans:', error);
            plansLoader.slideUp();
        }
    }




});