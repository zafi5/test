import React, { useState } from "react";
import { Button, Form, Input, Radio, DatePicker, message } from "antd";
import moment from "moment";

type FieldType = {
  name?: string;
  fathername?: string;
  mothername?: string;
  gender?: string;
  nid?: string;
  dob?: string;
  presentaddress?: string;
  permanentaddress?: string;
  mobile?: string;
};

const App: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const onFinish: any = async (values: FieldType) => {
    console.log("Success:", values);
    const {
      name,
      fathername,
      mothername,
      gender,
      nid,
      dob,
      presentaddress,
      permanentaddress,
      mobile,
    } = values;

    const url = "http://localhost:3000/data";

    const requestbody = {
      name: name,
      fathername: fathername,
      mothername: mothername,
      gender: gender,
      nid: nid,
      dob: moment(dob).format("YYYY-MM-DD"),
      presentaddress: presentaddress,
      permanentaddress: permanentaddress,
      mobile: mobile,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestbody),
      });

      if (response.ok) {
        setIsSuccess(true);
        message.success("User Registration Sucessfull");
      } else {
        setIsSuccess(false);
        message.error("User Registration Failed");
      }
    } catch (error) {
      setIsSuccess(false);
      message.error("User Registration Failed");
      console.error("Error:", error);
    }
  };

  const onFinishFailed: any = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      {isSuccess === true && <p>Customer created Successfully</p>}
      {isSuccess === false && <p>User Registration Failed</p>}
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your Name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="FatherName"
          name="fathername"
          rules={[
            { required: true, message: "Please input your Father Name!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mothername"
          name="mothername"
          rules={[
            { required: true, message: "Please input your Mother Name!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="NID"
          name="nid"
          rules={[{ required: true, message: "Please input your NID No!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Date of Birth"
          name="dob"
          rules={[
            { required: true, message: "Please Select Your Date of Birth!" },
          ]}
        >
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label="Present Address"
          name="presentaddress"
          rules={[
            { required: true, message: "Please input your Present Address!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Permanent Address"
          name="permanentaddress"
          rules={[
            { required: true, message: "Please input your Permanent Address!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mobile"
          name="mobile"
          rules={[
            { required: true, message: "Please input your Mobile Number!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: "Please select your Gender!" }]}
        >
          <Radio.Group>
            <Radio value="Male">Male</Radio>
            <Radio value="Female">Female</Radio>
            <Radio value="Other">Other</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            signup
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default App;
