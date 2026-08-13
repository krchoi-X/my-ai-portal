# AI Radar — Workflows

발견한 AI 제작 워크플로우를 capability 중심으로 기록한다. 목표는 몇 달 뒤에도 “비슷한 거 언제 봤는데 뭐였지?”를 자연어 검색으로 다시 찾는 것.

## MiniMax H3 Motion Context
- Creator: NikoDemon80
- Capability: long clip chaining / motion + audio continuity
- Key idea: 이전 클립의 마지막 프레임과 오디오 컨텍스트를 다음 클립에 전달
- Why interesting: H3의 ~15초 한계를 넘어 멀티클립 연속 장면 제작에 활용 가능
- Practical note: latent 기반 연결로 seam과 audio continuity를 줄이는 방향
- Status: **Watch / High priority**
- Source: https://github.com/NikoDemon80/ComfyUI-H3-Motion-Context

## MiniMax H3 — 3 Images + Sound to Video
- Capability: multi-reference Ref2VA scene generation
- Inputs: character image ×2 + prop/reference image ×1 + reference audio
- Key idea: `<Picture 1>`, `<Picture 2>`, `<Picture 3>`, `<Audio 1>` 태그를 연결 순서대로 사용
- Audio role: 영상에 나중에 붙이는 오디오가 아니라 packed latent에서 영상과 함께 생성되어 pacing/sync에 큰 영향
- Typical config observed: 10s, 1376×768, Turbo LoRA, 6-step sampling
- Good for: 2인 대화, character+prop shot, synced voice/ambient sound
- Limitation: node 자체의 extension path는 없음; 긴 영상은 다른 chaining workflow와 조합 필요
- Status: **Watch / High priority**

## MiniMax H3 Director
- Creator/upstream: AIMixer
- Mirror/package: huangserva
- Capability: T2V / FL2V-I2V / R2V / V2V / RV2V
- Why interesting: 여러 H3 제작 패턴을 “director console” 형태로 묶어 즉시 사용 가능
- RV2V highlight: shot 단위 분할, segment execution + cache, 한 구간 수정 시 전체 timeline 재렌더 불필요
- Verified environment in repo: RTX 4090 48GB, ComfyUI 0.30.0, PyTorch 2.11 + CUDA 12.8, H3 Ref2VA INT8
- Model note: R2V/V2V/RV2V는 Ref2VA; T2V/I2V/FL2V는 fl2va weight 필요
- Limitation: hard identity lock 아님; segment handoff가 character consistency 검사를 대체하지 않음
- Status: **Watch / High priority**
- Source: https://github.com/huangserva/ComfyUI_MiniMaxH3_Director

## H3 long-form strategy
- Pattern: short high-quality clips → continuity/chaining → selective rerender → final assembly
- Reason: 현재 장편 one-pass보다 짧은 clip을 반복 생성하고 좋은 결과만 조립하는 방식이 비용/통제/수정성에서 유리
- Related: H3 Motion Context + Director segment cache + Ref2VA multi-reference workflows
- Status: **Working hypothesis**
