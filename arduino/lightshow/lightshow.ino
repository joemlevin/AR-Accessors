/** lightshow.ino
 *  Specifies the behavior of the NeoPixel Light Show CPS
 *  Authors: Joseph Levin, Marsalis Gibson
 *  Adapted and modified based on the NeoPixel guide found at
 *  https://learn.adafruit.com/multi-tasking-the-arduino-part-3/overview
**/

#include <Adafruit_NeoPixel.h>
#include <SoftwareSerial.h>
#ifdef __AVR__
  #include <avr/power.h>
#endif

// Define constants for NeoPixel ring
const byte NUM_PIXELS = 24;

#define PIN 7

// Parameter 1 = number of pixels in strip
// Parameter 2 = Arduino pin number (most are valid)
// Parameter 3 = pixel type flags, add together as needed:
//   NEO_KHZ800  800 KHz bitstream (most NeoPixel products w/WS2812 LEDs)
//   NEO_KHZ400  400 KHz (classic 'v1' (not v2) FLORA pixels, WS2811 drivers)
//   NEO_GRB     Pixels are wired for GRB bitstream (most NeoPixel products)
//   NEO_RGB     Pixels are wired for RGB bitstream (v1 FLORA pixels, not v2)
//   NEO_RGBW    Pixels are wired for RGBW bitstream (NeoPixel RGBW products)
Adafruit_NeoPixel strip = Adafruit_NeoPixel(24, PIN, NEO_GRB + NEO_KHZ800);
int incomingByte;
int bufferCleared = 0;
int bluetoothTx = 2;  // TX-O pin of bluetooth mate, Arduino
int bluetoothRx = 3;  // RX-I pin of bluetooth mate, Arduino D3
SoftwareSerial bluetooth(bluetoothTx, bluetoothRx);

//Program States
typedef enum{
  INVALID=0, //Eventually remove this
  RESET=1,
  COLOR_WIPE,
  RAINBOW_CYCLE,
  THEATER_CHASE,
  SCANNER,
  FADE,
  INITIAL
} LightshowState_t;

///////////////////////////////////////
// Data Structure and Helper Methods //
///////////////////////////////////////

//LightShow displays NeoPixel light shows
class LightShow : public Adafruit_NeoPixel {
  private:
    //Private Member Variables
    LightshowState_t light_show_; // which light show is running

    unsigned long interval_; // milliseconds between steps in the light show
    unsigned long last_update_; // time of last update, to be compared with current time

    // specifies which colors to start a show with
    uint32_t current_color_; //Only used for ColorWipe
    uint32_t color1_;
    uint32_t color2_;

    uint16_t total_steps_; // total number of steps in the light show
    uint16_t index_; // current step in the light show
    void  (*OnComplete_)(); // Callback function for when show is complete
  public:
    // Constructor - calls base class to initialize Adafruit_NeoPixel
    LightShow(uint16_t num_pixels, uint8_t pin, uint8_t type, void (*callback)()=NULL)
    : Adafruit_NeoPixel(num_pixels, pin, type) {
      OnComplete_ = callback;
      }

    //Method for handling stepping through the light show. Checks if an interval length of time
    //has passed and if so, calls the appropriate update method depending on which show is active
    void Step() {
      if ((millis() - last_update_) > interval_) {
        //Update last_update to reflect that a step has occured
        last_update_ = millis();
        //Switch case to determine which update state should be entered
        switch(light_show_) {
          case COLOR_WIPE:
            ColorWipeStep();
            break;
          case RAINBOW_CYCLE:
            RainbowCycleStep();
            break;
          case THEATER_CHASE:
            TheaterChaseStep();
            break;
          case SCANNER:
            ScannerStep();
            break;
          case FADE:
            FadeStep();
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
        if (light_show_ == COLOR_WIPE){
          ColorWipeSwitch();
        }
        if (OnComplete_ != NULL) {
          OnComplete_(); // Handle callback logic for completed light show
        }
      }
    }

    // Initialize Color Wipe show
    void ColorWipe(uint32_t color, uint8_t interval) {
      light_show_ = COLOR_WIPE;
      interval_ = interval;
      total_steps_ = numPixels();
      color1_ = color;
      color2_ = Color(0,0,0);
      index_ = 0;
      current_color_ = color1_;
    }
    // Perform update for Color Wipe show
    void ColorWipeStep() {
      setPixelColor(index_, current_color_);
      show();
      Increment();
    }

    void ColorWipeSwitch() {
      if (current_color_ == color1_){
        current_color_ = color2_;
      }else{
        current_color_ = color1_;
      }
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
      total_steps_ = (numPixels() - 1) * 2;
      color1_ = color1;
      index_ = 0;
    }

    // Perform step for the Scanner show
    void ScannerStep() {
      for (int i = 0; i < numPixels(); i++) {
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
      total_steps_ = steps;
    }

    // Perform step for Fade show
    void FadeStep() {
      // Calculate linear interpolation between color1_ and color2_
      uint8_t red = ((Red(color1_) * (total_steps_ - index_)) + (Red(color2_) * index_)) / total_steps_;
      uint8_t green = ((Green(color1_) * (total_steps_ - index_)) + (Green(color2_) * index_)) / total_steps_;
      uint8_t blue = ((Blue(color1_) * (total_steps_ - index_)) + (Blue(color2_) * index_)) / total_steps_;

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
    uint8_t Green(uint32_t color) {
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
      return color;
    }

    // Resets the LightShow by turning off all LEDS and clearing Variables
    void Reset() {
      for (int i = 0; i < numPixels(); i++) {
        setPixelColor(i, Color(0, 0, 0));
      }
      show();
      light_show_ = RESET;
      interval_ = 0;
      index_ = 0;
      color1_ = Color(0, 0, 0);
      color2_ = Color(0, 0, 0);
      last_update_ = 0;
      total_steps_ = 0;
    }
};

// Returns true if a message is a valid show
bool IsValidShow(byte msg) {
  return (msg > 0 && msg <= 6);
}

// Define LightShow for NeoPixel 24-LED Ring
LightShow ring = LightShow(NUM_PIXELS, PIN, NEO_GRB + NEO_KHZ800);

////////////////////////////////////////////////////////
///////         Finite State Machine            ////////
////////////////////////////////////////////////////////

void LightshowFSM(byte incoming_msg, bool new_show){
  static LightshowState_t            state = INITIAL;  //Current State in program
  static LightshowState_t            next_show = INVALID;  //Next Show to Play
  
  // Define other constants
  static const byte INVALID_MSG = 0;
  
  //*****************************************************
  // state data - process inputs                        *
  //*****************************************************
  if (new_show){
    next_show = (IsValidShow(incoming_msg)) ? static_cast<LightshowState_t>(incoming_msg) : INVALID;
    if (next_show == INVALID 
        || next_show == INITIAL
        || next_show == state){
      new_show = false;
    }
  }

  //*****************************************************
  // state actions                       *
  //*****************************************************

  switch (state){
    case INITIAL:
      // Initialize NeoPixel
      break;
    case RESET: 
      ring.Reset(); 
      break;
    case COLOR_WIPE: 
      ring.Step(); 
      break;
    case RAINBOW_CYCLE: 
      ring.Step(); 
      break;
    case THEATER_CHASE: 
      ring.Step(); 
      break;
    case SCANNER: 
      ring.Step(); 
      break;
    case FADE: 
      ring.Step();
      break;
    default: 
      break;
  }


  //*****************************************************
  // state transitions                                  *
  //*****************************************************

  if (state == INITIAL){
    state = RESET;
  }
  else if (state == RESET && next_show == COLOR_WIPE){
    //Prepare to transition into COLOR_WIPE
    ring.ColorWipe(ring.Color(255, 0, 0), 55);
    next_show = INVALID;
    new_show = false;
    //Take the transition
    state = COLOR_WIPE;
  }
  else if (state == RESET && next_show == RAINBOW_CYCLE){
    //Prepare to transition into RAINBOW_CYCLE
    ring.RainbowCycle(3);
    next_show = INVALID;
    new_show = false;
    //Take the transition
    state = RAINBOW_CYCLE;
  }
  else if (state == RESET && next_show == THEATER_CHASE){
    //Prepare to transition into THEATER_CHASE
    ring.TheaterChase(ring.Color(255, 255, 0), ring.Color(0, 50, 0), 100);
    next_show = INVALID;
    new_show = false;
    //Take the transition
    state = THEATER_CHASE;
  }
  else if (state == RESET && next_show == SCANNER){
    //Prepare to transition into SCANNER
    ring.Scanner(ring.Color(255, 0, 0), 55);
    next_show = INVALID;
    new_show = false;
    //Take the transition
    state = SCANNER;
  }
  else if(state == RESET && next_show == FADE){
    //Prepare to transition into FADE
    ring.Fade(ring.Color(255, 0, 0), ring.Color(0, 0, 255), 100, 55);
    next_show = INVALID;
    new_show = false;
    //Take the transition
    state = FADE;
  }
  else if ((state == COLOR_WIPE
            || state == RAINBOW_CYCLE
            || state == THEATER_CHASE
            || state == SCANNER
            || state == FADE)
           && new_show 
    ){
      //Prepare to transition to RESET
      
      //Take the transition
      state = RESET;
    }
}

// Define variables for analyzing incoming messages from BT and storing
// desired show option
byte incoming_msg = 0;
bool is_new = false;

void setup() {
  Serial.begin(9600);
  bluetooth.begin(115200);  // The Bluetooth Mate defaults to 115200bps
  bluetooth.print("$");  // Print three times individually
  bluetooth.print("$");
  bluetooth.print("$");  // Enter command mode
  delay(100);  // Short delay, wait for the Mate to send back CMD
  bluetooth.println("U,9600,N");  // Temporarily Change the baudrate to 9600, no parity
  // 115200 can be too fast at times for NewSoftSerial to relay the data reliably
  bluetooth.begin(9600);  // Start bluetooth serial at 9600
  while (bluetooth.available() > 0) { // Ensure buffer is cleared at start
    bluetooth.read();
  }
  Serial.print("I am read to start!!");

  // Initialize NeoPixel
  ring.begin();
  ring.show();
}

void loop() {
  LightshowFSM(incoming_msg, is_new);
  is_new = false;
  // If a new message is available, check if valid
  if (bluetooth.available()) {
    
    incoming_msg = bluetooth.read();
    // Delete this line when you are done with tests. Sending to bluetooth through serial. //
    incoming_msg = (incoming_msg - 'A') + 1;
    Serial.print(incoming_msg);
    is_new = true;
  }
}

