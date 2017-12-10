#include <Adafruit_NeoPixel.h>
#ifndef LIGHTSHOW_H
#define LIGHTSHOW_H
class LightShow : public Adafruit_NeoPixel {
  private:
    //Private Member Variables
    show_type light_show_; // which light show is running

    unsigned long interval_; // milliseconds between steps in the light show
    unsigned long last_update_; // time of last update, to be compared with current time

    // specifies which colors to start a show with
    uint32_t color1_;
    uint32_t color2_;

    uint16_t total_steps_; // total number of steps in the light show
    uint16_t index_; // current step in the light show
    void  (*OnComplete_)(); // Callback function for when show is complete
  public:
    // Constructor - calls base class to initialize Adafruit_NeoPixel
    LightShow(uint16_t num_pixels, uint8_t pin, uint8_t type, void (*callback)()=NULL)
    : Adafruit_NeoPixel(num_pixels, pin, type);
    //Method for handling stepping through the light show. Checks if an interval length of time
    //has passed and if so, calls the appropriate update method depending on which show is active
    void Step();
    //Increment index, reset if end is reached
    void Increment();
    // Initialize Color Wipe show
    void ColorWipe(uint32_t color, uint8_t interval);
    // Perform update for Color Wipe show
    void ColorWipeStep();
    // Initialize Rainbow Cycle show
    void RainbowCycle(uint8_t interval);
    // Perform step for Rainbow Cycle show
    void RainbowCycleStep();
    // Initialize Theater Chase show
    void TheaterChase(uint32_t color1, uint32_t color2, uint8_t interval);
    // Perform step for Theater Chase show
    void TheaterChaseStep();
    // Initialize Scanner show
    void Scanner(uint32_t color1, uint8_t interval);
    // Perform step for the Scanner show
    void ScannerStep();
    // Initialize Fade show
    void Fade(uint32_t color1, uint32_t color2, uint16_t steps, uint8_t interval);
    // Perform step for Fade show
    void FadeStep();
    // Calculate dimmed color, used by ScannerStep
    uint32_t DimColor(uint32_t color);
    // Set all pixels to a color (synchronously)
    void ColorSet(uint32_t color);
    // Returns only the red component of a 32-bit color
    uint8_t Red(uint32_t color);
    // Returns only the green component of a 32-bit color
    uint8_t Green(uint32_t color);
    // Returns only the blue component of a 32-bit color
    uint8_t Blue(uint32_t color);
    // Input a value from 0 to 255 and get a color value
    // Transitions from r - g - b
    uint32_t Wheel(byte WheelPos);
    // Resets the LightShow by turning off all LEDS and clearing Variables
    void Reset();

};
#endif
