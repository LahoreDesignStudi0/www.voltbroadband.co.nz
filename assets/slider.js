document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.slider'); // Select all sliders
  if(sliders.length){
    sliders.forEach((slider) => {
      const slides = slider.querySelectorAll('.slider__slide'); // Select all slides within the slider
      const prevButton = slider.querySelector('.slider-button--prev'); // Previous button
      const nextButton = slider.querySelector('.slider-button--next'); // Next button
      const slideCount = slides.length; // Number of slides
      let currentIndex = 0; // Start with the first slide
  
      // Function to update the slider position
      const updateSlider = () => {
        const slideWidth = slides[0].offsetWidth; // Get the width of a single slide
        const offset = -currentIndex * slideWidth; // Calculate the offset for the current slide
        slider.querySelector('ul').style.transform = `translateX(${offset}px)`; // Apply the translation
      };
  
      // Function to enable or disable navigation buttons
      const updateButtons = () => {
        if (prevButton) prevButton.disabled = currentIndex === 0; // Disable "prev" if on the first slide
        if (nextButton) nextButton.disabled = currentIndex === slideCount - 1; // Disable "next" if on the last slide
      };
  
      // Event listener for "next" button
      if (nextButton) {
        nextButton.addEventListener('click', () => {
          if (currentIndex < slideCount - 1) {
            currentIndex += 1; // Move to the next slide
            updateSlider();
            updateButtons();
          }
        });
      }
  
      // Event listener for "prev" button
      if (prevButton) {
        prevButton.addEventListener('click', () => {
          if (currentIndex > 0) {
            currentIndex -= 1; // Move to the previous slide
            updateSlider();
            updateButtons();
          }
        });
      }
  
      // Initialize the slider
      const sliderList = slider.querySelector('ul');
      if(sliderList){
        sliderList.style.display = 'flex'; // Ensure slides are displayed inline
        sliderList.style.transition = 'transform 0.5s ease-in-out'; // Add smooth scrolling effect
        sliderList.style.overflow = 'hidden'; // Hide overflow
        slides.forEach((slide) => (slide.style.flex = '0 0 auto')); // Ensure slides have fixed width
      }
  
      updateButtons(); // Update buttons on load
    });
  }
});
