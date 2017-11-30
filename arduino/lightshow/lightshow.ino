#include <Adafruit_NeoPixel.h>

//Enumeration of shows supported
enum show_type {NONE, COLOR_WIPE}

//LightShow displays NeoPixel light shows
class LightShow : public Adafruit_NeoPixel {
  private:
    //Private Member Variables
    show_type light_show_; // which light show is running

    unsigned long interval_; // milliseconds between steps in the light show
    unsigned long last_update_; // time of last update, to be compared with current time

    uint32_t color1_; // specifies which color to start a show with
    
    uint16_t total_steps_; // total number of steps in the light show
    uint16_t index_; // current step in the light show
    void  (*OnComplete_)(); // Callback function for when show is complete
  public:
    // Constructor - calls base class to initialize Adafruit_NeoPixel
    LightShow(uint16_t num_pixels, uint8_t pin, uint8_t type, void (*callback)())
    :AdaFruit_NeoPixel(num_pixels, pin, type) {
      OnComplete_ = callback;
      }

    //Method for handling stepping through the light show. Checks if an interval length of time
    //has passed and if so, calls the appropriate update method depending on which show is active
    void Step() {
      if ((millis() - last_update_) > interval_) {
        //Update last_update to reflect that an update has occured
        last_update_ = millis();
        //Switch case to determine which update state should be entered
        switch(light_show_) { //TODO: Implement rest of shows
          case COLOR_WIPE:
            ColorWipeStep();
            break;
          default:
            break; 
        }
      }
    }
    
    //Increment index, reset if end is reached
    void Increment() {
      index++;
      if (index >= total_steps) {
        index = 0;
        if (OnComplete != NULL) {
          OnComplete(); // Handle callback logic for completed light show
        }
      }
    }

    // Initialize Color Wipe show
    void ColorWipe(uint32_t color, uint8_t interval) {
      light_show_ = COLOR_WIPE;
      interval_ = interval;
      color1_ = color;
      index_ = 0; 
    }

    // Perform update for Color Wipe show
    void ColorWipeStep() {
      setPixelColor(index_, color1_);
      show();
      Increment();
    }
}

void setup() {
  // put your setup code here, to run once:

}

void loop() {
  // put your main code here, to run repeatedly:

}
