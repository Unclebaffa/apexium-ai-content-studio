import os
import sqlite3
from datetime import datetime
from pathlib import Path

import requests
import streamlit as st
from dotenv import load_dotenv
from google import genai


# =========================================================
# PROJECT CONFIGURATION
# =========================================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = PROJECT_ROOT / ".env"
DATABASE_FILE = PROJECT_ROOT / "apexium_content.db"

load_dotenv(dotenv_path=ENV_FILE)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MAKE_WEBHOOK_URL = os.getenv("MAKE_WEBHOOK_URL")


# =========================================================
# DATABASE FUNCTIONS
# =========================================================

def get_database_connection():
    """Create and return a connection to the SQLite database."""

    return sqlite3.connect(DATABASE_FILE)


def initialise_database():
    """Create the content table if it does not already exist."""

    with get_database_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS content_generations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                topic TEXT NOT NULL,
                tone TEXT NOT NULL,
                platform TEXT NOT NULL,
                model TEXT NOT NULL,
                content TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'Draft',
                created_at TEXT NOT NULL
            )
            """
        )


def save_content(
    topic: str,
    tone: str,
    platform: str,
    model: str,
    content: str,
    status: str,
):
    """Save generated content to the SQLite database."""

    created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with get_database_connection() as connection:
        connection.execute(
            """
            INSERT INTO content_generations (
                topic,
                tone,
                platform,
                model,
                content,
                status,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                topic,
                tone,
                platform,
                model,
                content,
                status,
                created_at,
            ),
        )


def get_previous_generations():
    """Return saved content with the most recent record first."""

    with get_database_connection() as connection:
        connection.row_factory = sqlite3.Row

        records = connection.execute(
            """
            SELECT *
            FROM content_generations
            ORDER BY id DESC
            """
        ).fetchall()

    return [dict(record) for record in records]


initialise_database()


# =========================================================
# PAGE CONFIGURATION
# =========================================================

st.set_page_config(
    page_title="Apexium AI Content Studio",
    page_icon="✨",
    layout="wide",
    initial_sidebar_state="expanded",
)


# =========================================================
# CUSTOM CSS
# =========================================================

st.markdown(
    """
    <style>
        .stApp {
            background:
                radial-gradient(
                    circle at top left,
                    #172554 0%,
                    transparent 35%
                ),
                radial-gradient(
                    circle at top right,
                    #4c1d95 0%,
                    transparent 30%
                ),
                #090d1a;
        }

        .block-container {
            max-width: 1250px;
            padding-top: 2rem;
            padding-bottom: 3rem;
        }

        .hero-card {
            padding: 2.2rem;
            border-radius: 24px;
            background: linear-gradient(
                135deg,
                rgba(37, 99, 235, 0.30),
                rgba(124, 58, 237, 0.25)
            );
            border: 1px solid rgba(255, 255, 255, 0.12);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.28);
            margin-bottom: 1.6rem;
        }

        .hero-title {
            font-size: 2.65rem;
            font-weight: 800;
            line-height: 1.1;
            margin-bottom: 0.7rem;
            color: #ffffff;
        }

        .hero-subtitle {
            color: #cbd5e1;
            font-size: 1.05rem;
            max-width: 820px;
            line-height: 1.7;
        }

        .section-label {
            font-size: 0.82rem;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #a78bfa;
            font-weight: 700;
            margin-bottom: 0.4rem;
        }

        .section-heading {
            font-size: 1.35rem;
            color: #ffffff;
            font-weight: 750;
            margin-bottom: 0.35rem;
        }

        .section-description {
            color: #94a3b8;
            font-size: 0.94rem;
            margin-bottom: 1rem;
        }

        .status-card {
            padding: 0.9rem 1rem;
            border-radius: 14px;
            border: 1px solid rgba(74, 222, 128, 0.25);
            background: rgba(22, 101, 52, 0.20);
            color: #bbf7d0;
            margin-bottom: 1rem;
        }

        .empty-state {
            min-height: 275px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: #64748b;
            border: 1px dashed rgba(148, 163, 184, 0.25);
            border-radius: 16px;
            padding: 2rem;
        }

        div[data-testid="stTextInput"] input,
        div[data-testid="stTextArea"] textarea {
            border-radius: 12px;
        }

        div[data-baseweb="select"] > div {
            border-radius: 12px;
        }

        .stButton > button {
            width: 100%;
            border: 0;
            border-radius: 13px;
            padding: 0.78rem 1rem;
            font-weight: 750;
            background: linear-gradient(
                90deg,
                #2563eb,
                #7c3aed
            );
            color: white;
            box-shadow: 0 10px 25px rgba(79, 70, 229, 0.35);
            transition: 0.2s ease;
        }

        .stButton > button:hover {
            transform: translateY(-2px);
            box-shadow: 0 14px 32px rgba(79, 70, 229, 0.48);
        }

        [data-testid="stSidebar"] {
            background: rgba(7, 12, 25, 0.98);
            border-right: 1px solid rgba(148, 163, 184, 0.12);
        }

        .footer-note {
            text-align: center;
            color: #64748b;
            font-size: 0.82rem;
            margin-top: 2rem;
        }
    </style>
    """,
    unsafe_allow_html=True,
)


# =========================================================
# SESSION STATE
# =========================================================

if "generated_content" not in st.session_state:
    st.session_state.generated_content = ""

if "editor_content" not in st.session_state:
    st.session_state.editor_content = ""

if "last_topic" not in st.session_state:
    st.session_state.last_topic = ""

if "last_tone" not in st.session_state:
    st.session_state.last_tone = ""

if "last_platform" not in st.session_state:
    st.session_state.last_platform = ""

if "last_model" not in st.session_state:
    st.session_state.last_model = ""


# =========================================================
# AI FUNCTIONS
# =========================================================

def create_prompt(
    topic: str,
    tone: str,
    platform: str,
) -> str:
    """Create a structured social media prompt."""

    return f"""
You are an expert social media content strategist working for Apexium.

Create one high-quality social media post using the information below.

Topic:
{topic}

Tone:
{tone}

Platform:
{platform}

Requirements:
- Write between 100 and 160 words.
- Begin with an engaging hook.
- Make the post useful, clear and easy to understand.
- Match the selected tone consistently.
- Make the content suitable for {platform}.
- Include one engaging question where appropriate.
- Include a clear call to action.
- Finish with exactly three relevant hashtags.
- Do not include labels such as "Hook", "Body" or "Call to action".
- Return only the final social media post.
"""


def generate_with_gemini(prompt: str) -> str:
    """Generate social media content using Gemini."""

    if not GEMINI_API_KEY:
        raise ValueError(
            "The Gemini API key could not be found. "
            "Please check your .env file."
        )

    client = genai.Client(api_key=GEMINI_API_KEY)

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )

    if not response.text:
        raise ValueError(
            "Gemini returned an empty response. Please try again."
        )

    return response.text.strip()

def trigger_make_webhook(
    topic: str,
    tone: str,
    platform: str,
    model: str,
    content: str,
) -> None:
    """Send approved content to the Make automation webhook."""

    if not MAKE_WEBHOOK_URL:
        raise ValueError(
            "The Make webhook URL was not found. "
            "Please check your .env file."
        )

    payload = {
        "topic": topic,
        "tone": tone,
        "platform": platform,
        "model": model,
        "content": content,
        "status": "Approved",
        "approved_at": datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        ),
    }

    response = requests.post(
        MAKE_WEBHOOK_URL,
        json=payload,
        timeout=20,
    )

    response.raise_for_status()


# =========================================================
# SIDEBAR
# =========================================================

with st.sidebar:
    st.markdown("## ✨ Apexium Studio")
    st.caption("Internal AI content workspace")

    st.divider()

    st.markdown("### Workflow")

    st.markdown(
        """
        1. Enter a content topic  
        2. Choose the content style  
        3. Select an AI provider  
        4. Generate and review  
        5. Save or approve
        """
    )

    st.divider()

    if GEMINI_API_KEY:
        st.markdown(
            """
            <div class="status-card">
                ● Gemini connection ready
            </div>
            """,
            unsafe_allow_html=True,
        )
    else:
        st.error("Gemini API key not detected.")

    st.caption(
        "OpenAI and Claude integrations will be added "
        "in the next development stage."
    )


# =========================================================
# HERO SECTION
# =========================================================

st.html(
    """
    <div class="hero-card">
        <div class="section-label">
            Apexium Internal Tool
        </div>

        <div class="hero-title">
            Create smarter social content with AI
        </div>

        <div class="hero-subtitle">
            Generate polished, platform-ready social media content
            using your preferred tone and AI model. Review the result
            before saving or approving it for automation.
        </div>
    </div>
    """
)


# =========================================================
# MAIN LAYOUT
# =========================================================

input_column, output_column = st.columns(
    [0.92, 1.08],
    gap="large",
)


# =========================================================
# INPUT PANEL
# =========================================================

with input_column:
    st.markdown(
        """
        <div class="section-label">
            Content Brief
        </div>

        <div class="section-heading">
            Tell the AI what to create
        </div>

        <div class="section-description">
            Provide the topic and select how the final post should sound.
        </div>
        """,
        unsafe_allow_html=True,
    )

    topic = st.text_area(
        "Content topic",
        placeholder=(
            "Example: How artificial intelligence helps "
            "small businesses save time"
        ),
        height=125,
    )

    tone_column, platform_column = st.columns(2)

    with tone_column:
        tone = st.selectbox(
            "Content tone",
            [
                "Professional",
                "Educational",
                "Promotional",
                "Conversational",
            ],
        )

    with platform_column:
        platform = st.selectbox(
            "Social platform",
            [
                "LinkedIn",
                "Facebook",
                "Instagram",
                "X / Twitter",
            ],
        )

    model_provider = st.selectbox(
        "AI model",
        [
            "Gemini",
            "OpenAI",
            "Claude",
        ],
    )

    generate_button = st.button(
        "✨ Generate Content",
        use_container_width=True,
    )

    st.caption(
        "Content will be generated for review. "
        "It will not be published automatically."
    )


# =========================================================
# CONTENT GENERATION
# =========================================================

if generate_button:
    clean_topic = topic.strip()

    if not clean_topic:
        st.warning(
            "Please enter a content topic before generating."
        )

    elif model_provider != "Gemini":
        st.info(
            f"{model_provider} integration has not been connected yet. "
            "Select Gemini for the current test."
        )

    else:
        prompt = create_prompt(
            topic=clean_topic,
            tone=tone,
            platform=platform,
        )

        try:
            with st.spinner(
                "Apexium AI is creating your content..."
            ):
                generated_text = generate_with_gemini(prompt)

            st.session_state.generated_content = generated_text
            st.session_state.editor_content = generated_text
            st.session_state.last_topic = clean_topic
            st.session_state.last_tone = tone
            st.session_state.last_platform = platform
            st.session_state.last_model = model_provider

            st.toast(
                "Content generated successfully.",
                icon="✅",
            )

        except Exception as error:
            st.error(
                f"Content generation failed: {error}"
            )


# =========================================================
# OUTPUT PANEL
# =========================================================

with output_column:
    st.markdown(
        """
        <div class="section-label">
            AI Output
        </div>

        <div class="section-heading">
            Generated content
        </div>

        <div class="section-description">
            Review and edit the draft before saving or approving it.
        </div>
        """,
        unsafe_allow_html=True,
    )

    if st.session_state.generated_content:
        edited_content = st.text_area(
            "Review and edit",
            height=310,
            label_visibility="collapsed",
            key="editor_content",
        )

        tone_info, model_info, word_count_info = st.columns(3)

        with tone_info:
            st.caption("Tone")
            st.write(st.session_state.last_tone)

        with model_info:
            st.caption("Model")
            st.write(st.session_state.last_model)

        with word_count_info:
            st.caption("Word count")
            st.write(len(edited_content.split()))

        save_column, approve_column = st.columns(2)

        with save_column:
            if st.button(
                "💾 Save Draft",
                use_container_width=True,
            ):
                if not edited_content.strip():
                    st.warning(
                        "There is no content to save."
                    )

                else:
                    save_content(
                        topic=st.session_state.last_topic,
                        tone=st.session_state.last_tone,
                        platform=st.session_state.last_platform,
                        model=st.session_state.last_model,
                        content=edited_content.strip(),
                        status="Draft",
                    )

                    st.success(
                        "Draft saved successfully."
                    )

        with approve_column:
            if st.button(
                "✅ Approve Content",
                use_container_width=True,
            ):
                if not edited_content.strip():
                    st.warning(
                        "There is no content to approve."
                    )
                else:
                    try:
                        trigger_make_webhook(
                            topic=st.session_state.last_topic,
                            tone=st.session_state.last_tone,
                            platform=st.session_state.last_platform,
                            model=st.session_state.last_model,
                            content=edited_content.strip(),
                        )

                        save_content(
                            topic=st.session_state.last_topic,
                            tone=st.session_state.last_tone,
                            platform=st.session_state.last_platform,
                            model=st.session_state.last_model,
                            content=edited_content.strip(),
                            status="Approved",
                        )

                        st.success(
                            "Content approved and sent to the "
                            "automation workflow successfully."
                        )

                    except requests.RequestException as error:
                        st.error(
                            "The content was not sent to Make. "
                            f"Webhook error: {error}"
                        )

                    except ValueError as error:
                        st.error(str(error))

        st.download_button(
            label="📥 Download Content",
            data=edited_content,
            file_name="apexium_social_media_post.txt",
            mime="text/plain",
            use_container_width=True,
        )

    else:
        st.html(
            """
            <div class="empty-state">
                <div style="text-align: center;">
                    <div style="font-size: 48px;">✨</div>

                    <h3 style="color: white; margin-top: 12px;">
                        Your generated post will appear here.
                    </h3>

                    <p style="color: #94a3b8; margin-top: 12px;">
                        Enter a topic and click
                        <strong>Generate Content</strong>
                        to begin.
                    </p>
                </div>
            </div>
            """
        )


# =========================================================
# PREVIOUS GENERATIONS
# =========================================================

st.divider()

st.markdown("## 📚 Previous Generations")

st.caption(
    "View content that has previously been saved or approved."
)

previous_generations = get_previous_generations()

if previous_generations:
    for record in previous_generations:
        record_title = (
            f"{record['topic']} · "
            f"{record['status']} · "
            f"{record['created_at']}"
        )

        with st.expander(record_title):
            detail_tone, detail_platform, detail_model, detail_status = (
                st.columns(4)
            )

            with detail_tone:
                st.caption("Tone")
                st.write(record["tone"])

            with detail_platform:
                st.caption("Platform")
                st.write(record["platform"])

            with detail_model:
                st.caption("AI model")
                st.write(record["model"])

            with detail_status:
                st.caption("Status")
                st.write(record["status"])

            st.text_area(
                "Saved content",
                value=record["content"],
                height=220,
                disabled=True,
                key=f"saved_content_{record['id']}",
            )

else:
    st.info(
        "No saved content yet. Generate a post "
        "and click Save Draft or Approve Content."
    )


# =========================================================
# FOOTER
# =========================================================

st.html(
    """
    <div class="footer-note">
        Apexium AI Content Studio · Internal content workflow
    </div>
    """
)