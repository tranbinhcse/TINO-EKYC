import styled from 'vue3-styled-components';

export const Steps = styled.div`
  font-size:20px !important
`;

export const EkycForm = styled.div`
  width: 100%;
  .cardimage{
    font-size: 20px;
    text-align: center;
    .ant-upload{
    
      text-align: center;
      button{
        margin-bottom: 20px;
      }
    }
  }
  .ant-card-body{
    .ant-spin{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #0b0a0aad;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-size: 20px;
    }
  }

  .khungcmnd {
    margin-top: 24px;
    margin-bottom: 24px;
    width: 100%;
    float: left;
}

  .group_cmnd{
    display:block;
    position:relative;
}
    .group_cmnd .cmnd {
        width: 25%;
        display: block;
        float: left;
        font-weight: 500;
        text-align: center;
        position:relative;
    }
.group_cmnd .cmnd:before{
    display:block;
    margin:0 auto 23px;
    content:'';
    width:96px;
    height:60px;
    background:#F6F6F6;
    padding:6px 9px;
}
.group_cmnd .cmnd_1:before{
    background:url(/assets/CCCD_Small.svg) center no-repeat,#F6F6F6;
    background-size:78px 45px;
}
.group_cmnd .cmnd_2:before{
    background:url(/assets/CCCD_Small.svg) center no-repeat,#F6F6F6;
    background-size:78px 45px;
    background-position-x:40px;
    opacity:1;
}
.group_cmnd .cmnd_3:before{
    background:url(/assets/CCCD_Small.svg) center no-repeat,#F6F6F6;
    background-size:78px 45px;
    opacity:.5;
}
.group_cmnd .cmnd_4:before{
    background:url(/assets/black_watermask.svg) center no-repeat,#F6F6F6;
    opacity:1;
}
.group_cmnd.sau .cmnd_1:before{
    background:url(/assets/CCCD_Sau.svg) center no-repeat,#F6F6F6;
    background-size:78px 45px;
}
.group_cmnd.sau .cmnd_2:before{
    background:url(/assets/CCCD_Sau.svg) center no-repeat,#F6F6F6;
    background-size:78px 45px;
    background-position-x:40px;
    opacity:1;
}
.group_cmnd.sau .cmnd_3:before{
    background:url(/assets/CCCD_Sau.svg) center no-repeat,#F6F6F6;
    background-size:78px 45px;
    opacity:.5;
}
.group_cmnd.sau .cmnd_4:before{
    background:url(/assets/sau__watermask.svg) center no-repeat,#F6F6F6;
    opacity:1;
}
.group_cmnd .cmnd:after{
    width:20px;
    height:20px;
    position:absolute;
    content:'';
    top:51px;
    left:50%;
    transform:translate(-50%, 0);
}
.group_cmnd .cmnd.er:after{
    background:url(/assets/Failer_ico.svg) center no-repeat, #FFF;
    background-size:contain;
    border-radius:50%;
}
.group_cmnd .cmnd.ok:after{
    background:url(/assets/Success_ico.svg) center no-repeat, #FFF;
    background-size:contain;
    border-radius:50%;
}
.new_h2 {
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    display: block;
    margin-bottom: 12px;
}
.chatruocsau{
    display: flex;
    flex: 0 1 auto;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 0 -10px -10px;
}
.mattruoc,
.matsau {
    display: flex;
    flex: 0 1 auto;
    flex-direction: row;
    flex-wrap: nowrap;
    background: #F6F6F6;
    border-radius: 8px;
    width:calc(50% - 20px);
    min-height:150px;
    padding:13px 18px;
    margin:0 10px 10px;
    position:relative;
    text-align:center;
}
.mattruoc:hover .change-img,
.matsau:hover .change-img{
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%, -50%);
    z-index:100;
    padding:40px 10px 10px;
    border-radius:8px;
    cursor:pointer;
    display: block !important;
    background:url(/assets/up-arrow.svg) center 10px no-repeat,#ffffffab;
}
.vmattruoc,
.vmatsau{
    display:none;
    width:100%;
    height:150px;
    position:relative;
}
.vmattruoc.ok:after,
.vmatsau.ok:after{
    background:url(/assets/Success_ico.svg) center no-repeat, #FFF;
    background-size:contain;
    border-radius:50%;
    width:20px;
    height:20px;
    position:absolute;
    top:-5px;
    right:-5px;
    content:'';
}
.vmattruoc.er:after,
.vmatsau.er:after{
    background:url(/assets/Failer_ico.svg) center no-repeat, #FFF;
    background-size:contain;
    border-radius:50%;
    width:20px;
    height:20px;
    position:absolute;
    top:-5px;
    right:-5px;
    content:'';
}
.vmattruoc img,
.vmatsau img{
    max-width:100%;
    max-height:100%;
    border-radius: 8px;
}
.change-img {
    display: inline-block;
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%, -50%);
    z-index:100;
    white-space: nowrap;
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
    margin: 0 auto;
    padding-top:30px;
    cursor:pointer;
    background: url(/assets/up-arrow.svg) top center no-repeat;
}
.change-img.load{
    background: url(../Content/images/loading.svg) top center no-repeat;
    background-size: 50px;
    margin-top:30px;
    padding-top:60px;
    pointer-events: none;
}


.face_icon{
  display:block;
}
.face_icon .item{
  display:block;
  float:left;
  width:33.3%;
  padding: 0 10px 16px;
  text-align:center;
}
.face_icon .item img{
  width:80px;
  height:80px;
  display:block;
  margin:0 auto 8px;
}




`;
export const VideoBox = styled.div`
      background: transparent;
      .video-box{
        position: relative;
        overflow: hidden;
        video{}
        .taken-photo{
            position: absolute;
            bottom: 20px;
            left: 50%;
            z-index: 1;
            transform: translateX(-50%);
        }
        .crop-image{
          position: absolute;
          top: 50%;
          left: 50%;
          -webkit-transform: translate(-50%, -50%);
          -moz-transform: translate(-50%, -50%);
          -ms-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
          border-color: #7FFF00;
          border-style: solid;
          width: 70%;
          height: 0%;
          padding-bottom: 44.136%;
          box-shadow: 0 0 0 600px rgba(0, 0, 0, 0.6);
        }
      }
      .pre-loading-video{
        width: 100%;
        text-align: center;
      }
      .cardimage{
        text-align: center;
        .ant-upload{
          min-width: 350px;
          text-align: center;
          button{
            margin-bottom: 20px;
          }
        }
      }
`;