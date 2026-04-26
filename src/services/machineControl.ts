import { ElLoading, ElMessage } from 'element-plus';

const MACHINE_LOGIN_PATH = '/api/admin/login/index';
const MACHINE_CONTROL_PATH = '/api/admin/machine/control';
const MACHINE_ID = 132;

const ACCESS_APPID = 'ty9fd2848a039ab554';
const LOGIN_PHONE = '18874890828';
const LOGIN_PASSWORD = 'zxc123';

let accessToken = '';
let loginPromise: Promise<string> | null = null;

export const machineControlButtons = [
  { label: '左二', control: '#000P2500T1000!' },
  { label: '左一', control: '#000P2000T1000!' },
  { label: '正中间', control: '#000P1500T1000!' },
  { label: '右一', control: '#000P1000T1000!' },
  { label: '右二', control: '#000P0500T1000!' },
  { label: '升起', control: '$MOT1000T6000!' },
  { label: '降落', control: '$MOT-1000T6000!' },
];

interface LoginResponse {
  userToken?: string;
  data?: {
    userToken?: string;
  };
}

export async function loginMachineControl() {
  if (accessToken) {
    return accessToken;
  }

  if (!loginPromise) {
    loginPromise = fetch(MACHINE_LOGIN_PATH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-appid': ACCESS_APPID,
      },
      body: JSON.stringify({
        phone: LOGIN_PHONE,
        password: LOGIN_PASSWORD,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`login failed: ${response.status}`);
        }

        const data = await response.json() as LoginResponse;
        const userToken = data.data?.userToken || data.userToken;
        if (!userToken) {
          throw new Error('login response missing userToken');
        }

        accessToken = userToken;
        return userToken;
      })
      .finally(() => {
        loginPromise = null;
      });
  }

  return loginPromise;
}

export async function sendControl(params?: { [key: string]: any }) {
  let token = await loginMachineControl();
  let response = await fetch(MACHINE_CONTROL_PATH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-appid': ACCESS_APPID,
      'x-access-token': token,
    },
    body: JSON.stringify({
      ...params,
    }),
  });

  if (response.status === 401 || response.status === 403) {
    accessToken = '';
    token = await loginMachineControl();
    response = await fetch(MACHINE_CONTROL_PATH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-appid': ACCESS_APPID,
        'x-access-token': token,
      },
      body: JSON.stringify({
        ...params,
      }),
    });
  }

  if (!response.ok) {
    throw new Error(`send control failed: ${response.status}`);
  }

  return response.json();
}

export const handleSendControl = async (control: string) => {
  const loading = ElLoading.service({
    text: '正在发送',
    background: 'rgba(255, 255, 255, 0.7)',
  });

  try {
    await sendControl({
      machineId: MACHINE_ID,
      control,
    });
    ElMessage.success('发送成功');
    return true;
  } catch (error) {
    console.error('send control failed', error);
    ElMessage.error('发送失败，请重试');
    return false;
  } finally {
    loading.close();
  }
};

export const handleLoginMachineControl = async () => {
  const loading = ElLoading.service({
    text: '正在登录',
    background: 'rgba(255, 255, 255, 0.7)',
  });

  try {
    await loginMachineControl();
    return true;
  } catch (error) {
    console.error('machine control login failed', error);
    ElMessage.error('设备控制登录失败，请重试');
    return false;
  } finally {
    loading.close();
  }
};
