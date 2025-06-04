"use client";

import React, { useState } from "react";
import BoxedInput from "../../components/Input/BoxedInput";

const Page = () => {
    const [value, setValue] = useState("");
    const [error, setError] = useState<string | undefined>(undefined);

    const handleChange = (value: string) => {
        setValue(value);
        setError(value.length < 3 ? "3글자 이상 입력하세요." : undefined);
    };

    return (
        <div style={{ maxWidth: 400, margin: "2rem auto" }}>
            <BoxedInput
                label="이름"
                value={value}
                onChange={handleChange}
                error={error}
                placeholder="이름을 입력하세요"
            />
        </div>
    );
};

export default Page;