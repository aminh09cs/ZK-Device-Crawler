# ZK Sync Agent 📡

[Vietnamese version below]

## 🌐 English Overview

The **ZK Sync Agent** is an Electron-based middleware designed to bridge the connectivity gap between local **Ronald Jack (ZK)** attendance hardware and the **Odoo Cloud** platform.

### 🔄 Data Flow Diagram

```mermaid
graph TD
    subgraph Local_Branch [Local Branch Office]
        A["ZK Device (Ronald Jack)"] -- "TCP/IP Port 4370" --> B["ZKService (Socket)"]
        B -- "Raw Logs & Users" --> C["SyncService (Orchestrator)"]
        D["config.json"] -- "Load Params" --> E["ConfigModule"]
        E -.-> C
        C -- "Formatted JSON" --> F["OdooService (HTTP)"]
        C -- "Status Events" --> G["Dashboard UI"]
        C -- "Log Events" --> H["File System (main.log)"]
    end

    subgraph Cloud [Cloud Server]
        F -- "HTTPS POST (Webhook)" --> I["Odoo Webhook Controller"]
    end
```

### 📋 Key Features
- **Reliable Sync**: Automated polling with exponential backoff retries for unstable internet.
- **Background Execution**: Runs silently in the system tray with auto-start capability.
- **Monitoring Dashboard**: Modern UI for real-time status and manual synchronization triggers.
- **Branch Specific**: Easily configurable via `config.json` without re-building the code.

---
