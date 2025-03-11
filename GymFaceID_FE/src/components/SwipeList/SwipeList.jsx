import React, { useContext } from "react";
import "./SwipeList.css";
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css";
import Sidebar from "../../assets/sidebar.png";
import Ecommerce from "../../assets/ecommerce.png";
import HOC from "../../assets/hoc.png";
import MusicApp from "../../assets/musicapp.png";
import { themeContext } from "../../Context";
const SwipeList = () => {
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;
  return (
    <div className="swipeList" id="swipeList">
      {/* heading */}
      <span style={{color: darkMode?'white': ''}}>Title</span>
      <span>List</span>

      {/* slider */}
      <Swiper
        spaceBetween={30}
        slidesPerView={3}
        grabCursor={true}
        className="swipeList-slider"
      >
        <SwiperSlide>
          <img src={Sidebar} alt="" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={Ecommerce} alt="" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={MusicApp} alt="" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={HOC} alt="" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default SwipeList;
