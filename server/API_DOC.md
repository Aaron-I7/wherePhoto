# WherePhoto 图床服务 API 文档

本服务提供图片上传、URL下载上传及图片列表查询功能。

## 基础信息
- **Base URL**: `http://localhost:3000` (本地部署)
- **CORS**: 允许所有跨域请求

## 1. 图片上传接口 (支持批量)

将本地图片文件上传到服务器。

- **URL**: `/api/upload`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`

### 请求参数
| 参数名 | 类型 | 必选 | 说明 |
|Ref |Type |Required |Description |
|---|---|---|---|
| `files` | File / File[] | 是 | 图片文件，支持多文件上传 |

### 示例 (Curl)
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/image2.png"
```

### 响应示例
```json
{
  "success": true,
  "data": [
    {
      "filename": "1705398293123-uuid.jpg",
      "originalName": "image1.jpg",
      "url": "http://localhost:3000/uploads/1705398293123-uuid.jpg"
    },
    {
      "filename": "1705398293124-uuid.png",
      "originalName": "image2.png",
      "url": "http://localhost:3000/uploads/1705398293124-uuid.png"
    }
  ]
}
```

---

## 2. URL 图片上传接口 (支持批量)

提供图片 URL，服务器自动下载并保存。

- **URL**: `/api/upload-url`
- **Method**: `POST`
- **Content-Type**: `application/json`

### 请求参数
| 参数名 | 类型 | 必选 | 说明 |
|---|---|---|---|
| `urls` | String[] | 是 | 图片 URL 数组 |

### 示例 (Curl)
```bash
curl -X POST http://localhost:3000/api/upload-url \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://example.com/image1.jpg", "https://example.com/image2.png"]}'
```

### 响应示例
```json
{
  "success": true,
  "results": [
    {
      "url": "https://example.com/image1.jpg",
      "success": true,
      "savedUrl": "http://localhost:3000/uploads/1705398355123-uuid.jpg"
    },
    {
      "url": "https://example.com/image2.png",
      "success": false,
      "error": "Request failed with status code 404"
    }
  ]
}
```

---

## 3. 获取图片列表

获取服务器上所有已上传的图片。

- **URL**: `/api/images`
- **Method**: `GET`

### 响应示例
```json
{
  "success": true,
  "data": [
    {
      "filename": "1705398293123-uuid.jpg",
      "url": "http://localhost:3000/uploads/1705398293123-uuid.jpg",
      "mtime": "2024-01-16T12:00:00.000Z"
    }
  ]
}
```
