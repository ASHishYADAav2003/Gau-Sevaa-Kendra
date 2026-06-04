import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { campaignApi } from '../api/services';
import { getApiErrorMessage } from '../api/client';
import type { Campaign } from '../api/types';
import { formatDate, formatInr } from '../utils/format';

const progressPercent = (campaign: Campaign) =>
  Math.min(100, Math.round((campaign.raisedAmountPaise / Math.max(campaign.targetAmountPaise, 1)) * 100));

export default function CampaignDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState({ donorName: '', donorEmail: '', donorPhone: '', commentText: '' });
  const [commentMessage, setCommentMessage] = useState('');

  useEffect(() => {
    if (!slug) return;

    const loadCampaign = async () => {
      try {
        const result = await campaignApi.getPublic(slug);
        setCampaign(result);
      } catch (err) {
        setError(getApiErrorMessage(err, 'Unable to load this campaign.'));
      } finally {
        setIsLoading(false);
      }
    };

    void loadCampaign();
  }, [slug]);

  const submitComment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!campaign) return;

    setCommentMessage('');
    try {
      await campaignApi.postComment(campaign.id, {
        donorName: comment.donorName,
        donorEmail: comment.donorEmail || undefined,
        donorPhone: comment.donorPhone || undefined,
        commentText: comment.commentText,
      });
      setComment({ donorName: '', donorEmail: '', donorPhone: '', commentText: '' });
      setCommentMessage('Comment submitted for moderation.');
    } catch (err) {
      setCommentMessage(getApiErrorMessage(err, 'Unable to submit comment.'));
    }
  };

  if (isLoading) {
    return <div className="max-w-5xl mx-auto px-4 py-16 text-gray-500">Loading campaign...</div>;
  }

  if (error || !campaign) {
    return <div className="max-w-5xl mx-auto px-4 py-16 text-red-700">{error || 'Campaign not found.'}</div>;
  }

  const percent = progressPercent(campaign);
  const image = campaign.images?.[0]?.imageUrl || campaign.animal?.images?.[0]?.imageUrl || '/hero-cow-calf.png';

  return (
    <div className="bg-brand-beige min-h-screen py-12">
      <Helmet>
        <title>{campaign.titleEn} | Gau Seva Kendra</title>
        <meta name="description" content={campaign.shortSummaryEn} />
      </Helmet>

      <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.4fr_0.8fr] gap-8 items-start">
          <div className="bg-white rounded-xl border border-orange-100 shadow-sm overflow-hidden">
            <img src={image} alt={campaign.titleEn} className="w-full h-[420px] object-cover" />
            <div className="p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{campaign.titleEn}</h1>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">{campaign.shortSummaryEn}</p>
              {campaign.fullStoryEn && <p className="text-gray-600 leading-8 whitespace-pre-line">{campaign.fullStoryEn}</p>}

              {campaign.updates && campaign.updates.length > 0 && (
                <section className="mt-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates</h2>
                  <div className="space-y-4">
                    {campaign.updates.map((update) => (
                      <div key={update.id} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                        <h3 className="font-semibold text-gray-900">{update.titleEn}</h3>
                        <p className="text-xs text-gray-500 mb-2">{formatDate(update.publishedAt)}</p>
                        <p className="text-sm text-gray-600">{update.bodyEn}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white rounded-xl border border-orange-100 shadow-sm p-6 sticky top-24">
              <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
                <span>{formatInr(campaign.raisedAmountPaise)} raised</span>
                <span>{percent}%</span>
              </div>
              <div className="h-3 rounded-full bg-orange-100 overflow-hidden mb-3">
                <div className="h-full bg-brand-orange" style={{ width: `${percent}%` }} />
              </div>
              <p className="text-sm text-gray-500 mb-6">Goal: {formatInr(campaign.targetAmountPaise)}</p>
              <Link to={`/donate?campaign=${campaign.id}`} className="btn-primary w-full justify-center inline-flex items-center gap-2 px-5 py-3">
                Donate to Campaign <Heart className="w-4 h-4 fill-white" />
              </Link>

              {campaign.animal && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-2">Linked Animal</h3>
                  <p className="text-sm text-gray-600">{campaign.animal.name} ({campaign.animal.tagId})</p>
                  <p className="text-xs text-gray-500">{campaign.animal.healthStatus || campaign.animal.status}</p>
                </div>
              )}
            </div>

            {campaign.commentsEnabled && (
              <div className="bg-white rounded-xl border border-orange-100 shadow-sm p-6">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-brand-orange" /> Comments
                </h2>

                <form onSubmit={submitComment} className="space-y-3 mb-5">
                  <input required className="input-field" placeholder="Your name" value={comment.donorName} onChange={(e) => setComment({ ...comment, donorName: e.target.value })} />
                  <input className="input-field" type="email" placeholder="Email optional" value={comment.donorEmail} onChange={(e) => setComment({ ...comment, donorEmail: e.target.value })} />
                  <textarea required className="input-field min-h-24" placeholder="Write a message" value={comment.commentText} onChange={(e) => setComment({ ...comment, commentText: e.target.value })} />
                  <button className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white">
                    Submit <Send className="w-4 h-4" />
                  </button>
                  {commentMessage && <p className="text-sm text-gray-600">{commentMessage}</p>}
                </form>

                <div className="space-y-3">
                  {(campaign.comments || []).map((item) => (
                    <div key={item.id} className="rounded-lg bg-gray-50 p-3">
                      <p className="font-semibold text-sm text-gray-900">{item.donorName}</p>
                      <p className="text-xs text-gray-500 mb-1">{formatDate(item.createdAt)}</p>
                      <p className="text-sm text-gray-600">{item.commentText}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </article>
    </div>
  );
}
