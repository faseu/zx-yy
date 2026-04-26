<template>
  <div class="call-h5">
    <div class="header">
      <Icon :src="LeftArrowSrc" @click="goHome"/>
      <p> {{ t('1v1 Call') }} </p>
    </div>
    <div class="content">
      <el-input
        class="call-input"
        v-model="calleeUserID"
        :placeholder="placeholderText"
        @input="handleCallUserID"
        @keyup.enter="handleCall"
      >
        <template #prepend> userID </template>
      </el-input>
      <div
        class="call-btn"
        @click="handleCall"
      > 
        {{ t('Initiate Call') }}
      </div>
      <div class="machine-control" :class="{ 'is-expanded': isControlExpanded }">
        <button class="machine-control-toggle" type="button" @click="toggleControl">
          {{ isControlExpanded ? '收起控制' : '设备控制' }}
        </button>
        <div v-if="isControlExpanded" class="machine-control-card">
          <button
            v-for="item in machineControlButtons"
            :key="item.control"
            class="machine-control-btn"
            type="button"
            @click="handleSendControl(item.control)"
          >
            {{ item.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useLanguage, useMyRouter } from '../../../hooks';
import useCall from '../useCall';
import { trim } from '../../../utils';
import Icon from '../../../components/common/Icon/Icon.vue';
import LeftArrowSrc from '../../../assets/Call/left-arrow.svg';
import { handleLoginMachineControl, handleSendControl, machineControlButtons } from '../../../services/machineControl';

const { t } = useLanguage();
const { navigate } = useMyRouter();
const { call } = useCall();
const calleeUserID = ref('');
const isControlExpanded = ref(false);

const placeholderText = computed(() => {
  return t('input the userID to Call');
})

const handleCall = async () => {
  await call(calleeUserID);
}

const handleCallUserID = () => {
  calleeUserID.value = trim(calleeUserID.value);
}

const goHome = () => {
  navigate('/home');
}

const toggleControl = async () => {
  if (isControlExpanded.value) {
    isControlExpanded.value = false;
    return;
  }

  const isLoginSuccess = await handleLoginMachineControl();
  if (isLoginSuccess) {
    isControlExpanded.value = true;
  }
}

</script>

<style lang="scss" scoped>
@import './Call.scss';
</style>
