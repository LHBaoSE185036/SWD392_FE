import React from 'react'
import { Layout } from 'antd'
import Sidebar from '../../../components/Sidebar'
import { Content } from 'antd/es/layout/layout'
import FaceScanPage from '../FaceScan-Page/FaceScanPage'

export default function HomePage() {
  return (
    <div>
      <Layout style={{ minHeight: "100vh" }} className='mainLayout'>
      <div class="shape" /> <div class="shape2" />
      
          <FaceScanPage />
        
    </Layout>
    </div>
  )
}
