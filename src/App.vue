<template>
   <ThemeProvider>
    <div class="ekyc-page">
      <img src="./assets/logo.png" alt="" class="logo">
      <EkycForm />
      <p style="color:red">(*) Vui lòng sử dụng thiết bị có camera/webcam để tiến hành xác thực (eKYC).</p>
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
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 20px;
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
