import React, { useState } from 'react';
import Aside from './Aside';
import Main from './Main';

function Layout({
    setLocale,
    content,
    collapsed,
    handleCollapsedChange,
    handleToggleSidebar,
    toggled,
}) {
    const [rtl, setRtl] = useState(false);

    const [image, setImage] = useState(true);

    const handleRtlChange = (checked) => {
        setRtl(checked);
        setLocale(checked ? 'ar' : 'en');
    };
    const handleImageChange = (checked) => {
        setImage(checked);
    };

    return (
        <div className={`app ${rtl ? 'rtl' : ''} ${toggled ? 'toggled' : ''}`}>
            <Aside
                image={image}
                collapsed={collapsed}
                rtl={rtl}
                toggled={toggled}
                handleToggleSidebar={handleToggleSidebar}
            />
            <Main
                image={image}
                toggled={toggled}
                collapsed={collapsed}
                rtl={rtl}
                handleToggleSidebar={handleToggleSidebar}
                handleCollapsedChange={handleCollapsedChange}
                handleRtlChange={handleRtlChange}
                handleImageChange={handleImageChange}
                content={content}
            />
        </div>
    );
}

export default Layout;
