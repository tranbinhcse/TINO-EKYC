<template>
   <ThemeProvider>
    <div class="ekyc-page">
      <p></p>
      <p style="color:red">(*) Vui lòng sử dụng thiết bị có camera/webcam để tiến hành xác thực (eKYC).</p>
      <EkycForm />
    

      <a-button type="secondary" @click="reloadPage">Tải lại trang</a-button>
      <img src="./assets/quytrinh.jpg" alt="" style=" width: 100%; max-width: 800px; ">
    </div>
    </ThemeProvider>
</template>

<script setup>
import 'ant-design-vue/dist/antd.css'; // or 'ant-design-vue/dist/antd.less'
import EkycForm from './components/ekyc/EkycForm.vue';
import { ThemeProvider } from "vue3-styled-components";
 
// export {};

// export default {
//   name: 'App',
//   components: {
//     EkycForm,
//     ThemeProvider
//   }
// }
const reloadPage = () => {
  window.location.reload();
}
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 14px;
  /* margin-top: 60px; */
}
.ekyc-page{
  max-width: 1024px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex: 1;
    align-items: center;
    height: 100vh;
    flex-direction: column;
    gap: 20px;
}
.logo{
  max-width: 200px;
  padding-bottom: 100px;
  padding-top: 50px;
}

</style>
