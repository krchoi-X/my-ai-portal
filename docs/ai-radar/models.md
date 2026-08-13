# AI Radar — Models

개인 AI 생태계 관찰용 기록. 모델 성능 자체보다 실제 사용성, 파생 생태계, 워크플로우 확장성, 실행 비용을 함께 본다.

## MiniMax H3
- Type: open-weight multimodal video generation
- Capabilities: text/image/video/audio conditioning, native stereo audio, up to ~15s and 2K
- Why interesting: ComfyUI native support, Ref2VA, fast-growing workflow ecosystem
- Ecosystem signals: Turbo LoRA, Director workflows, Motion Context, multi-reference workflows
- Status: **Watch / High priority**
- Notes: 몇 분짜리 쇼츠는 짧은 클립 조립 + context chaining 방식이 현실적
- Source: https://huggingface.co/MiniMaxAI/MiniMax-H3

## LTX-2.5
- Type: open-weight video foundation model
- Capabilities: native multishot, stronger continuity, auto duration, native 4K HDR, RAW workflow, fine-tuning
- Why interesting: longer narrative/video workflow candidate, official ComfyUI path
- Ecosystem note: ID/voice LoRA, talking-head, long-story style community extensions가 빠르게 붙는 중
- Status: **Watch / High priority**
- Source: https://ltx.io/model/ltx-2-5

## Gemma 4 31B
- Type: local LLM / long-form writing baseline
- Current role: Runpod long-form fiction writer baseline
- Why interesting: local ownership, predictable cost, comparison point for modified variants and future Qwen releases
- Status: **Active test**

## dealignai/Gemma-4-31B-JANG_4M-CRACK
- Type: modified / abliterated Gemma 4 31B, MLX-native JANG v2
- Why interesting: refusal reduction을 노린 modified-model ecosystem 사례
- Caveat: 원본은 vMLX 중심이라 Runpod/Linux Ollama용으로 바로 쓰기 불편
- Status: **Watch / A-B test candidate**
- Source: https://huggingface.co/dealignai/Gemma-4-31B-JANG_4M-CRACK

## douyamv/Gemma-4-31B-JANG_4M-CRACK-GGUF
- Type: GGUF conversion of dealignai JANG_4M CRACK
- Why interesting: llama.cpp / LM Studio / Ollama에서 바로 시험 가능한 배포 형태
- Practical candidate: Q4_K_M ~18.7GB; 32GB급 GPU에서 A/B하기 쉬운 편
- Status: **Test candidate**
- Source: https://huggingface.co/douyamv/Gemma-4-31B-JANG_4M-CRACK-GGUF

## llmfan46/gemma-4-31B-it-uncensored-heretic-GGUF
- Type: Gemma 4 31B decensored / abliterated GGUF
- Why interesting: modified local writing-model 대안; llama.cpp 계열에서 직접 비교 가능
- Caveat: refusal 감소가 장편 문체/일관성 향상을 뜻하지는 않으므로 반드시 별도 장기 테스트 필요
- Status: **Watch / A-B test candidate**
- Source: https://huggingface.co/llmfan46/gemma-4-31B-it-uncensored-heretic-GGUF

## Qwen 3.6 27B / 35B-A3B
- Type: local LLM candidates
- Why interesting: future Gemma challenger; 특히 장편 반복/안정성 개선 여부가 관심사
- Status: **Watch / Test when convenient**

## Kimi K3
- Type: frontier proprietary/hosted LLM reference
- Observed role: single-scene fiction quality reference / occasional hard-scene model
- Why interesting: 캐릭터에서 자연스럽게 새 행동·디테일을 발명하는 능력이 강했음
- Constraint: Venice 등 유료 사용 시 장편 전체 생성에는 비용 부담이 큼
- Status: **Reference / occasional use**

## GLM 5.2
- Type: hosted frontier LLM
- Observed role: single-scene fiction은 강하지만 장편 안정성은 경계
- User-side failure pattern observed: 약 10장 이상, 다수 캐릭터에서 반복·문체 붕괴·오류 증가 경험
- Lesson: advertised long context != behavioral long-form stability
- Status: **Downgraded for long-form main writer**

## Kimi K2.5
- Type: hosted LLM
- Observed role: creative invention은 괜찮았으나 blind baseball test에서 game-state continuity 오류 발생
- Status: **Secondary / caution for state tracking**
