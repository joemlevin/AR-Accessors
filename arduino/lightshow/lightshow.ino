#include <Adafruit_NeoPixel.h>

//Enumeration of shows supported
enum show_type {NONE, COLOR_WIPE, RAINBOW_CYCLE, THEATER_CHASE}

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
        //Update last_update to reflect that a step has occured
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
      index_++;
      if (index_ >= total_steps_) {
        index_ = 0;
        if (OnComplete_ != NULL) {
          OnComplete_(); // Handle callback logic for completed light show
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

    // Initialize Rainbow Cycle show
    void RainbowCycle(uint8_t interval) {
        light_show_ = RAINBOW_CYCLE;
        Interval_ = interval;
        total_steps_ = 255;
        index_ = 0;
    }
    
    // Perform step for Rainbow Cycle show
    void RainbowCycleStep() {
        for(int i=0; i< numPixels(); i++) {
            setPixelColor(i, Wheel(((i * 256 / numPixels()) + index_) & 255));
        }
        show();
        Increment();
    }

    // Initialize Theater Chase show
    void TheaterChase(uint32_t color1, uint32_t color2, uint8_t interval) {
        light_show_ = THEATER_CHASE;
        interval_ = interval;
        total_steps_ = numPixels();
        color1_ = color1;
        color2_ = color2;
        index_ = 0;
   }
    
    // Update the Theater Chase Pattern
    void TheaterChaseStep() {
        for(int i=0; i< numPixels(); i++)
        {
            if ((i + index_) % 3 == 0)
            {
                setPixelColor(i, color1_);
            }
            else
            {
                setPixelColor(i, color2_);
            }
        }
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
