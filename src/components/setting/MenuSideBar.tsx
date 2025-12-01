import { Menu, Modal, type MenuProps } from 'antd'
import { useMemo } from 'react'
import './settingStyle.css'
import { useUnsavedChanges } from './context/UnsavedChangesContext'
import { useTranslation } from 'react-i18next'
import { AccountIcon } from '../icons/AccountIcon'
import { FileTextIcon } from '../icons/FileTextIcon'
import { useLocation, useNavigate } from 'react-router-dom'

type MenuItem = Required<MenuProps>['items'][number]

export const MenuSideBar = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { hasUnsavedChanges } = useUnsavedChanges()
    const [modal, contextHolder] = Modal.useModal()
    const { t } = useTranslation()
    const keyToUrlMap: Record<string, string> = {
        '1': '/setting',
        '2': '/setting/changePassword',
        '3': '/setting/language',
    }

    const urlToKeyMap: Record<string, string> = Object.entries(
        keyToUrlMap
    ).reduce(
        (acc, [key, value]) => {
            acc[value] = key
            return acc
        },
        {} as Record<string, string>
    )

    const selectedKey = useMemo(() => {
        return urlToKeyMap[location.pathname] ?? '1'
    }, [location.pathname])

    const items: MenuItem[] = [
        {
            key: 'myAccount',
            label: t('My Account'),
            icon: <AccountIcon />,
            children: [
                { key: '1', label: t('My Profile') },
                { key: '2', label: t('Security') },
                { key: '3', label: t('Language') },
            ],
        },
    ]

    const onClick: MenuProps['onClick'] = (e) => {
        const url = keyToUrlMap[e.key]
        if (!url || url === location.pathname) return

        if (hasUnsavedChanges) {
            modal.confirm({
                title: t('Are you sure want to leave this page'),
                content: t('Unsaved changes will be lost'),
                okText: t('Leave'),
                cancelText: t('Cancel'),
                onOk: () => {
                    navigate(url)
                },
            })
        } else {
            navigate(url)
        }
    }

    const defaultOpenKey = () => {
        if (['1', '2'].includes(selectedKey)) {
            return ['myAccount']
        }
        return []
    }

    return (
        <>
            {contextHolder}
            <Menu
                onClick={onClick}
                style={{ width: 254, backgroundColor: 'transparent' }}
                defaultOpenKeys={defaultOpenKey()}
                selectedKeys={[selectedKey]}
                mode="inline"
                items={items}
                className="custom-menu !bg-transparent [&_.ant-menu-item-selected]:!bg-transparent !border-none"
            />
        </>
    )
}

