import { useState } from "react";
import { useNavigate } from "hooks/useNavigate";
import { useParams } from "react-router-dom";

/**
 * SCR-COM-0007 帳票管理画面 基本情報タブ
 * @returns
 */
const ScrCom0007BasicTab = () => {
    // router
    const { corporationId } = useParams();
    const navigate = useNavigate();

    // state
    const [selectValues, setSelectValues] = useState<SelectValuesModel>(
        selectValuesInitialValues
    );

    return (
        <>
        </>
    )
}
export default ScrCom0007BasicTab;
