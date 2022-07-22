#include <ESP8266WiFi.h>
//必须修改：填写你的WIFI帐号密码
const char* ssid = "Xiaomi_92BD";
const char* password = "x6916357Xjygd";

const char* host = "192.168.31.56";
const int port = 2424;

WiFiClient client;

void setup() {
  //初始化串口
  Serial.begin(115200);
  delay(10);

  // Connect to WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  //连接WIFI
  WiFi.begin(ssid, password);
  //设置读取socket数据时等待时间为100ms（默认值为1000ms，会显得硬件响应很慢）
  client.setTimeout(100);
  //等待WIFI连接成功
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");

}

void loop() {
  //连接TCP服务器
  if (client.connect(host, port))
  {
    // 串口打印，连接成功
    Serial.println("client connected to the host");
    //发送TCP数据
    client.println("hello~");
  }
  else
  {
    // 串口打印，连接失败
    Serial.println("client connection failure");
  }

  while (client.connected())
  {
    delay(1000);
    //发送TCP数据
    client.println("tick");

    //接收到数据
    if (client.available())
    {
      String line = client.readStringUntil('\n');
      //串口打印所接收到的数据
      Serial.print("receive:");
      Serial.println(line);
    }
  }

}
