import { State } from "./state.js";

export const Personality = {
  0:{
    mood:"happy",
    sway:0.06,
    color:0xff3366,
    text:"اگه منو نداشتی الان چی‌کار می‌کردی؟ 😌",
    music:"happy"
  },
  1:{
    mood:"lonely",
    sway:0.03,
    color:0xff88aa,
    text:"کم پیدایی… من حواسم بهت هستا",
    music:"lonely"
  },
  2:{
    mood:"sad",
    sway:0.015,
    color:0xaa6677,
    text:"کم‌کم دارم پژمرده می‌شم…",
    music:"sad"
  },
  3:{
    mood:"dying",
    sway:0.005,
    color:0x663344,
    text:"من هنوز دوستت دارم… حتی اینجوری",
    music:"sad"
  }
}[State.stage];
