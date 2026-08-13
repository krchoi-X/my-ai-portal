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
- Status: **Watch / High priority**
- Source: https://ltx.io/model/ltx-2-5

## Gemma 4 31B
- Type: local LLM / long-form writing baseline
- Current role: Runpod long-form fiction writer baseline
- Why interesting: local ownership, predictable cost, comparison point for modified variants and future Qwen releases
- Status: **Active test**

## Qwen 3.6 27B / 35B-A3B
- Type: local LLM candidates
- Why interesting: stability improvements claimed over prior Qwen generation; candidate challenger to Gemma 4 for long-form writing
- Status: **Watch / Test when convenient**
