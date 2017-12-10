/** lightshow.ino
 *  Specifies the behavior of the NeoPixel Light Show CPS
 *  Author: Joseph Levin
 *  Adapted and modified based on the NeoPixel guide found at 
 *  https://learn.adafruit.com/multi-tasking-the-arduino-part-3/overview
**/

#include <Adafruit_NeoPixel.h>

// Define macros for NeoPixel ring
#define PIN 7
#define NUM_PIXELS 24;

// Define macros for bluetooth
#define BLUETOOTH_TX 2; // TX-0 pin of BlueSMiRF
#DEFINE BLUETOOTH_RX 3; // RX-I pin of BlueSMiRF

//Enumeration of shows supported
enum show_type {NONE, COLOR_WIPE, RAINBOW_CYCLE, THEATER_CHASE, SCANNER};
enum  pattern { NONE, COLOR_WIPE, RAINBOW_CYCLE, THEATER_CHASE, SCANNER, FADE };

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
        interval_ = interval;
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
    
    // Perform step for Theater Chase show
    void TheaterChaseStep() {
        for(int i=0; i< numPixels(); i++) {
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

    // Initialize Scanner show
    void Scanner(uint32_t color1, uint8_t interval) {
      light_show_ = SCANNER;
      interval_ = interval;
      total_steps_ = (numPixels - 1) * 2;
      color1_ = color1;
      index_ = 0;
    }

    // Perform step for the Scanner show
    void ScannerStep() {
      for (int i = 0; i < numPixel(); i++) {
        if (i == index_) { // Scan Pixel to the right
          setPixelColor(i, color1_);
        } else if (i == total_steps_ - index_) {
          setPixelColor(i, color1_);
        } else { // Fading tail
          setPixelColor(i, DimColor(getPixelColor(i)));
        }
        show();
        Increment();
      }
    }

    // Initialize Fade show
    void Fade(uint32_t color1, uint32_t color2, uint16_t steps, uint8_t interval) {
      light_show_ = FADE;
      interval_ = interval;
      color1_ = color1;
      color2_ = color2;
      index_ = 0;
    }

    // Perform step for Fade show
    void FadeStep() {
      // Calculate linear interpolation between color1_ and color2_
      uint8_t red = ((Red(color1_) * (total_steps_ - index_)) + (Red(color2_) * index_) / total_steps_;
      uint8_t green = ((Green(color1_) * (total_steps_ - index_)) + (Green(color2_) * index_) / total_steps_;
      uint8_t blue = ((Blue(color1_) * (total_steps_ - index_)) + (Blue(color2_) * index_) / total_steps_;

      ColorSet(Color(red, green, blue));
      show();
      Increment();
    }

    // Calculate dimmed color, used by ScannerStep
    uint32_t DimColor(uint32_t color) {
      uint32_t dimmedColor = Color(Red(color) >> 1, Green(color) >> 1, Blue(color) >> 1);
      return dimmedColor;
    }

    // Set all pixels to a color (synchronously)
    void ColorSet(uint32_t color) {
      for (int i = 0; i < numPixels(); i++) {
        setPixelColor(i, color);
      }
      show();
    }

    // Returns only the red component of a 32-bit color
    uint8_t Red(uint32_t color) {
      return (color >> 16) & 0xFF;
    }

    // Returns only the green component of a 32-bit color
    uint8_t green(uint32_t color) {
      return (color >> 8) & 0xFF;
    }

    // Returns only the blue component of a 32-bit color
    uint8_t Blue(uint32_t color) {
      return color & 0xFF;
    }

    // Input a value from 0 to 255 and get a color value
    // Transitions from r - g - b
    uint32_t Wheel(byte WheelPos) {
      WheelPos = 255 - WheelPos;
      uint32_t color = 0;
      if (WheelPos < 85) {
        color = Color(255 - WheelPos * 3, 0, WheelPos * 3);
      } else if (WheelPos < 170) {
        WheelPos -= 85;
        color = Color(0, WheelPos * 3, 255 - WheelPos * 3);
      } else {
        WheelPos -= 170;
        color = Color(WheelPos * 3, 255 - WheelPos * 3, 0);
      }
    }
}

//
// Define LightShow for NeoPixel 24-LED Ring
NeoPattern ring = NeoPattern(NUM_PIXELS, PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  // put your setup code here, to run once:

}

void loop() {
  // put your main code here, to run repeatedly:

}
