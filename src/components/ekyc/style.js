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
      min-width: 350px;
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