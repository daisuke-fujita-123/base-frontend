const changeHistoryColumns: GridColDef[] = [
    {
        field: 'id',
        headerName: '変更履歴番号',
        cellType: 'link',
    },
];

interface changeHistoryRowModel {
    id: string;
}

const chnageHistoryData: changeHistoryRowModel[] = [
    {
        id: '00000001',
    },
    {
        id: '00000002',
    },
    {
        id: '00000003',
    },
    {
        id: '00000004',
    },
];

const hrefs = [
    {
        field: 'id',
        id: '00000001',
        href: '/mem/corporations/CORP-1?change-history-number=00000001#basic',
    },
    {
        field: 'id',
        id: '00000002',
        href: '/mem/corporations/CORP-1?change-history-number=00000002#credit',
    },
    {
        field: 'id',
        id: '00000003',
        href: '/mem/corporations/CORP-1?change-history-number=00000003#credit-limit',
    },
    {
        field: 'id',
        id: '00000004',
        href: '/mem/corporations/CORP-1?change-history-number=00000004#contract',
    },
];

const ScrCom0007ChangeHistoryTab = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLinkClick = (url: string) => {
        navigate(url, true);
    };

    return (
        <MainLayout>
            <MainLayout main>
                <Section name='変更履歴'>
                    <DataGrid
                        columns={changeHistoryColumns}
                        rows={chnageHistoryData}
                        hrefs={hrefs}
                        onLinkClick={handleLinkClick}
                    />
                </Section>
            </MainLayout>
        </MainLayout>
    );
};

export default ScrCom0007ChangeHistoryTab;
