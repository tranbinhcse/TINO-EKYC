<template>
    <div>
        

        <a-modal  type="primary" 
            :width="650"  
            v-model:visible="visible"  
            title="Hướng dẫn chụp mặt trước CMT" 
            @ok="handleOk" 
            :maskClosable="false" 
            okText="Đã hiểu"
            :centered="true"
        >
                <a-list size="large" :data-source="data">
                    <template #renderItem="{ item }">
                        <a-list-item>{{ item }}</a-list-item>
                    </template>
                </a-list>
        
        </a-modal>
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
const data = [
    'Ảnh CMT phải là ảnh gốc, không scan và photocopy.', 
    'Hãy cho phép web truy cập vào thiết bị camera của bạn.', 
    'Nếu bạn dùng tablet, có thể xoay dọc thiết bị nếu camera bị khuất.', 
    'Khi chụp, để mặt trước CMT bao trọn trong viền xanh trên màn hình.',
    'Chụp ảnh rõ ràng, đủ góc cạnh, không bị lóa sáng, không che nội dung CMT.',
    'Kết quả OCR sẽ được hiển thị ở ô \'Thông tin CMT\' sau khi ảnh được xử lý.',
    'Người chụp ảnh chịu hoàn toàn trách nhiệm trước pháp luật về thông tin đã cung cấp.'

];


export default defineComponent({
    emits: ['comfirm'],
  setup(props, {emit}) {
    const visible = ref(true);
    const handleOk = () => {
      visible.value = false;
      emit('comfirm', true);
    console.log(props)
    };

   

    return {
      visible,
      handleOk,
      data
    };
  },
});
</script>