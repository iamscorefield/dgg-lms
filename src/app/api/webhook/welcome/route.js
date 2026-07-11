import { NextResponse } from 'next/server';
import { Resend } from 'resend';
// Forces Next.js to skip pre-rendering this endpoint as a static page during build time
export const dynamic = "force-dynamic";
// Initialize the Resend pipeline using your secure environment token
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    // Parse the incoming webhook payload directly from Supabase
    const payload = await req.json();
    
    // Supabase webhook payload structure puts the new user data inside 'record'
    const { email } = payload.record || {};

    if (!email) {
      return NextResponse.json({ error: 'No target email found in database payload record' }, { status: 400 });
    }

    // Fire the custom HTML onboarding matrix through the verified Resend pipe
    const data = await resend.emails.send({
      from: 'D-Global Growthfield <no-reply@dglobalgrowthfield.com>',
      to: [email],
      subject: 'Welcome to D-Global Growthfield! Your Digital Roadmap Architecture 🚀',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to D-Global Growthfield</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f5fa; padding: 20px; margin: 0; color: #1a1a1a; -webkit-font-smoothing: antialiased;">
            <div style="max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 24px; border: 1px solid #e9e3f0; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(81, 45, 124, 0.05);">
                
                <!-- Premium Brand Header -->
                <div style="background-color: #512d7c; padding: 45px 40px; text-align: center; border-bottom: 5px solid #f2b42c;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; tracking-tight: -0.03em; letter-spacing: 0.5px;">D-GLOBAL GROWTHFIELD</h1>
                    <p style="color: #f2b42c; margin: 8px 0 0 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em;">...Inspired by Growth</p>
                </div>
                
                <!-- Content Body -->
                <div style="padding: 40px; line-height: 1.7; font-size: 15px; color: #333333;">
                    <h2 style="color: #512d7c; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 20px;">Welcome to Your Digital Roadmap Hub 🚀</h2>
                    
                    <p>I want to personally welcome you to our tech-driven educational ecosystem. By creating an account, you have officially initialized a journey toward professional advancement, borderless digital competence, and modern capability alignment.</p>
                    
                    <p>Our foundational philosophy is structured around a single execution-oriented framework: giving you the structured blueprints to <strong>learn</strong> high-demand skills, <strong>grow</strong> your authority, and <strong>earn</strong> globally by working remotely from anywhere in the world.</p>

                    <!-- Video Onboarding Section Placeholder -->
                    <div style="margin: 30px 0; background: #faf9fc; border: 2px dashed #512d7c; border-radius: 20px; padding: 25px; text-align: center;">
                        <span style="font-size: 30px; display: block; margin-bottom: 10px;">🎬</span>
                        <h4 style="color: #512d7c; margin: 0 0 10px 0; font-size: 16px; font-weight: 700;">Watch Your Welcome & System Orientation Video</h4>
                        <p style="font-size: 13px; color: #666666; margin: 0 0 20px 0; max-width: 480px; margin-left: auto; margin-right: auto;">
                            Take a brief tour with our leadership team to understand how to maximize the learning system resources and navigate your educational path.
                        </p>
                        <a href="https://learning.dglobalgrowthfield.com" target="_blank" style="display: inline-block; background-color: #512d7c; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 12px 28px; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.05em; box-shadow: 0 4px 6px rgba(81, 45, 124, 0.15);">
                            Play Orientation Video ➔
                        </a>
                    </div>

                    <hr style="border: 0; border-top: 1px solid #e9e3f0; margin: 35px 0;">

                    <!-- Section 1: The Preparatory Course Structure -->
                    <h3 style="color: #512d7c; font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 12px;">
                        📚 Phase 1: The Foundational Preparatory Architecture
                    </h3>
                    <p>To establish an elite digital footprint, you need to transition systematically. Our curated blueprint breaks down into <strong>8 core preparatory courses</strong> designed to transition raw beginners into structured workspace professionals:</p>
                    
                    <div style="background-color: #fdfdfd; border: 1px solid #e9e3f0; border-radius: 20px; padding: 25px; margin-bottom: 30px;">
                        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                            <tr>
                                <td style="padding: 8px 0; vertical-align: top; width: 30px; font-weight: bold; color: #f2b42c;">01.</td>
                                <td style="padding: 8px 0; color: #4a4a4a;">Basic Computer & Internet Skills for Absolute Beginners</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; vertical-align: top; font-weight: bold; color: #f2b42c;">02.</td>
                                <td style="padding: 8px 0; color: #4a4a4a;">Getting Ready for Online Learning Ecosystems</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; vertical-align: top; font-weight: bold; color: #f2b42c;">03.</td>
                                <td style="padding: 8px 0; color: #4a4a4a;">Introduction to Your Modern Techie Journey</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; vertical-align: top; font-weight: bold; color: #f2b42c;">04.</td>
                                <td style="padding: 8px 0; color: #4a4a4a;">Introduction to No-Code Tools & Building Your First App/Website</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; vertical-align: top; font-weight: bold; color: #f2b42c;">05.</td>
                                <td style="padding: 8px 0; color: #4a4a4a;">Cybersecurity Fundamentals for Operational Safety</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; vertical-align: top; font-weight: bold; color: #f2b42c;">06.</td>
                                <td style="padding: 8px 0; color: #4a4a4a;">Introduction to Artificial Intelligence (AI) Workflows</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; vertical-align: top; font-weight: bold; color: #f2b42c;">07.</td>
                                <td style="padding: 8px 0; color: #4a4a4a;">Legal Registration and Structural Compliance of Business in Nigeria</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; vertical-align: top; font-weight: bold; color: #f2b42c;">08.</td>
                                <td style="padding: 8px 0; color: #4a4a4a; font-weight: 600; color: #512d7c;">Digital Monetization — Securing Sustainable Online Opportunities</td>
                            </tr>
                        </table>
                        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #e9e3f0; font-size: 13px; color: #666666; font-style: italic;">
                            💡 <strong>Includes Weekly Live Mentorship:</strong> Review your ongoing practical execution matrices live with industrial tutors.
                        </div>
                    </div>

                    <!-- CTA 1: Launch Learning Interface -->
                    <div style="text-align: center; margin-bottom: 40px;">
                        <a href="https://learning.dglobalgrowthfield.com" target="_blank" style="display: inline-block; background-color: #512d7c; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 16px 36px; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.05em; box-shadow: 0 4px 12px rgba(81, 45, 124, 0.25);">
                            Enter Learning Workspace Portal ➔
                        </a>
                    </div>

                    <hr style="border: 0; border-top: 1px solid #e9e3f0; margin: 35px 0;">

                    <!-- Section 2: Radio Broadcast Network -->
                    <h3 style="color: #512d7c; font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 12px;">
                        🎙️ Phase 2: Tune In to The Digital Growth Hour
                    </h3>
                    <p>Education extends beyond the terminal platform window. To stay synchronized with operational insights, market changes, and local growth blueprints, join our broadcast pipeline completely free on-air:</p>
                    
                    <div style="background-color: #fffdf7; border: 1px solid #fbeccb; border-radius: 20px; padding: 25px; margin-bottom: 35px;">
                        <p style="margin-top: 0; font-size: 14px; color: #555555;">
                            Hosted by <strong>Justina Onyekachi (Joet)</strong>, our live broadcast intervals break down remote asset capture mechanics and global value deployment strategies:
                        </p>
                        <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px; background: #ffffff; border: 1px solid #fbeccb; border-radius: 12px 0 0 12px; width: 50%;">
                                    <strong style="color: #512d7c; display: block; font-size: 14px;">Lagos Ecosystem</strong>
                                    <strong>TOP RADIO 90.9 FM</strong><br>
                                    Saturdays: 11:30 AM — 12:00 PM<br>
                                    <span style="color: #666666; font-size: 11px;">Focus: Unlocking digital remote asset vectors.</span>
                                </td>
                                <td style="padding: 10px; background: #ffffff; border: 1px solid #fbeccb; border-radius: 0 12px 12px 0; width: 50%;">
                                    <strong style="color: #512d7c; display: block; font-size: 14px;">Abeokuta Hub</strong>
                                    <strong>SWEET FM 107.1</strong><br>
                                    Thursdays: 10:00 AM — 11:00 AM<br>
                                    <span style="color: #666666; font-size: 11px;">Focus: Breaking down structural tech skills.</span>
                                </td>
                            </tr>
                        </table>
                        <p style="margin-bottom: 0; margin-top: 15px; font-size: 13px; text-align: center; color: #512d7c; font-weight: 600;">
                            📡 Streaming Globally Live online at: <a href="https://live.dglobalgrowthfield.com" target="_blank" style="color: #f2b42c; text-decoration: underline;">live.dglobalgrowthfield.com</a>
                        </p>
                    </div>

                    <p style="margin-bottom: 0;">Commit to the architecture, follow your milestone markers, and let's execute perfectly.</p>
                    
                    <!-- Corporate Sign-off Matrix -->
                    <div style="margin-top: 45px; padding-top: 25px; border-top: 1px solid #e9e3f0;">
                        <p style="margin: 0; font-size: 16px; font-weight: 800; color: #512d7c; letter-spacing: -0.3px;">Scorefield</p>
                        <p style="margin: 3px 0 0 0; font-size: 12px; color: #7f8c8d; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Chief Executive Officer</p>
                        <p style="margin: 1px 0 0 0; font-size: 12px; color: #a2a2a2; font-weight: 500;">D-Global Growthfield Ecosystem</p>
                    </div>
                </div>
                
                <!-- Regional Infrastructure Footer -->
                <div style="background-color: #faf9fc; padding: 30px 40px; text-align: center; border-top: 1px solid #e9e3f0; font-size: 11px; color: #95a5a6; line-height: 1.6;">
                    <p style="margin: 0 0 8px 0; font-weight: 600; color: #7f8c8d;">COMMUNICATION CORRIDOR VIA WHATSAPP: 0912492316</p>
                    <p style="margin: 0 0 15px 0;">
                        <strong>Lagos Physical Hub:</strong> 17 Karimu Str, Gbagada<br>
                        <strong>Abeokuta Physical Hub:</strong> Office 5, Silver Cross, Leme
                    </p>
                    <p style="margin: 0; font-size: 10px; color: #bdc3c7;">
                        &copy; 2026 D-Global Growthfield. All system parameters and organizational onboarding pathways are structurally protected.
                    </p>
                </div>
            </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true, messageId: data.id });
  } catch (error) {
    console.error('Webhook processing failure node:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}