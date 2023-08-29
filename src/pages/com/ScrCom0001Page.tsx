import React, { useContext, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'utils/yup';

import { CenterBox, MarginBox } from 'layouts/Box';
import { Stack } from 'layouts/Stack';

import { PrimaryButton } from 'controls/Button';
import { Dialog } from 'controls/Dialog';
import { TextField } from 'controls/TextField';

import {
  PasswordLoginRequest,
  PasswordLoginResponse,
  ScrCom0001PasswordLogin,
} from 'apis/com/ScrCom0001';

import { useForm } from 'hooks/useForm';

import { MessageContext } from 'providers/MessageProvider';

import { Box } from '@mui/material';

/**
 * SCR-COM-0001 ログイン画面
 */
const ScrCom0001Page = () => {
  const validationSchama = {
    employeeId: yup.string().label('ID').required(),
    password: yup.string().label('パスワード').required(),
  };

  const methods = useForm<PasswordLoginRequest>({
    defaultValues: {
      employeeId: '',
      password: '',
    },
    resolver: yupResolver(yup.object(validationSchama)),
    context: false,
  });

  const style = {
    minHeight: 58,
    height: 58,
    width: 236,
    ml: 3,
  };

  // TOP画面に遷移
  const navigate = useNavigate();
  const request = methods.getValues();
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);

  const handleLogin = async () => {
    try {
      const response: PasswordLoginResponse = await ScrCom0001PasswordLogin(
        request
      );
      response.rtnCode && navigate('/com/top');
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setIsOpenDialog(true);
      }
      throw err;
    }
  };

  const { getMessage } = useContext(MessageContext);
  return (
    <FormProvider {...methods}>
      {/* TODO ロゴ差し替え*/}
      <Box
        sx={{
          ...style,
        }}
      >
        Logo
      </Box>
      <CenterBox height='60vh'>
        <Stack>
          <TextField name='employeeId' label='ID'></TextField>
          <TextField
            name='password'
            label='パスワード'
            type='password'
          ></TextField>
          <MarginBox mt={5}>
            <PrimaryButton onClick={handleLogin} size='large'>
              ログイン
            </PrimaryButton>
          </MarginBox>
        </Stack>
      </CenterBox>
      {/* ダイアログ */}
      <Dialog open={isOpenDialog} title={getMessage('MSG-0002')} buttons={[]} />
    </FormProvider>
  );
};

export default ScrCom0001Page;
