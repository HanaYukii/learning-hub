---
title: 線段樹維護矩陣乘積
tags: [線段樹, 矩陣, dp]
why: 「線性遞推 × 區間 × 點修改」通法;乘積非交換、順序易錯——非顯然
trigger: DP/遞推能寫成「定長向量 ← 矩陣 × 向量」,且要區間連乘或單點改一個轉移
problems:
  - { name: "(示意) 帶修改的線性遞推 / 固定長度路徑計數", url: "", rating: 2500 }
reviewed: 2026-07-01
review_interval: 14
---

# 線段樹維護矩陣乘積

- **觸發**:狀態能寫成定長向量 $v$,轉移 $v_i = M_i\,v_{i-1}$(費氏、固定長度 walk 計數、線性 DP);需要「區間矩陣連乘」或「單點改一個 $M_i$ 後重查」。
- **核心**:線段樹每個節點存「該段矩陣的乘積」。點改 = 改葉子 + 沿路 pushup;區間查 = 把 $O(\log n)$ 個節點矩陣相乘。
- **複雜度**:每次 $O(k^3\log n)$,$k$ = 矩陣維度(要小,通常 $\le 30\text{–}60$)。

## 關鍵:乘積非交換,順序別錯

$$
v_r=\Big(\textstyle\prod_{i=l}^{r}M_i\Big)v_{l-1}\ \Rightarrow\ \text{seg}[x]=\text{seg}[\text{right}]\cdot\text{seg}[\text{left}].
$$

(大下標在左乘;方向相反就互換。)空段、單位元都用單位矩陣。

## 模板

```cpp
const int K = 2;                 // 矩陣維度
struct Mat {
    long long a[K][K];
    Mat(bool id=false){ memset(a,0,sizeof a);
        if(id) for(int i=0;i<K;i++) a[i][i]=1; }
};
Mat operator*(const Mat&A,const Mat&B){          // A·B (mod)
    Mat C; for(int i=0;i<K;i++) for(int k=0;k<K;k++){
        if(!A.a[i][k]) continue;
        for(int j=0;j<K;j++)
            C.a[i][j]=(C.a[i][j]+A.a[i][k]*B.a[k][j])%MOD;
    } return C;
}

vector<Mat> seg; int n;
void pull(int x){ seg[x]=seg[2*x+1]*seg[2*x]; }  // right · left,順序看方向
void upd(int x,int l,int r,int p,const Mat&v){
    if(l==r){ seg[x]=v; return; }
    int m=(l+r)/2; p<=m?upd(2*x,l,m,p,v):upd(2*x+1,m+1,r,p,v); pull(x);
}
Mat qry(int x,int l,int r,int ql,int qr){         // 回傳該段乘積
    if(qr<l||r<ql) return Mat(true);              // 單位元
    if(ql<=l&&r<=qr) return seg[x];
    int m=(l+r)/2;
    return qry(2*x+1,m+1,r,ql,qr)*qry(2*x,l,m,ql,qr); // right · left
}
```

## 要點 / 易錯
- **順序**:`right · left`,查詢合併也要同序。寫反會「過 sample、WA 大測資」。
- $k^3$ 常數重:$k$ 大就不行。$k\le 60$、$n,q\le 2\times10^5$ 大概是上限。
- 模運算別溢位(`long long` 累加;必要時 `__int128`)。

## 例題 / 來源
- ICPC 印尼那場卡住的「線段樹搭矩陣乘法」就是這招(個人心結題)。
- 典型:帶單點修改的固定長度路徑/walk 計數、可改轉移的線性 DP 區間查詢。
